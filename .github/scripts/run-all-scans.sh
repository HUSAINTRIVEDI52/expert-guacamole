#!/bin/bash
# =============================================================================
# run-all-scans.sh
# Scans: SonarQube SAST
# Output: Imported to DefectDojo → final report as GitHub artifact
# =============================================================================

set -euo pipefail

# ── Paths ────────────────────────────────────────────────────────────────────
WORKSPACE="${HOME}/security-scan"
APP_DIR="${WORKSPACE}/app"          # Scan entire repo root
REPORTS_DIR="${WORKSPACE}/reports"
LOG_FILE="${REPORTS_DIR}/scan.log"

# ── State ────────────────────────────────────────────────────────────────────
SONAR_RESULT="skipped"
UNIT_RESULT="skipped"
NEWMAN_RESULT="skipped"
ZAP_RESULT="skipped"
IMPORT_COUNT=0
FINAL_FORMAT="none"
DOJO_IMPORT_FAILED=false

# ── Logging ──────────────────────────────────────────────────────────────────
mkdir -p "${REPORTS_DIR}"
exec > >(tee -a "${LOG_FILE}") 2>&1

log()  { echo "[$(date '+%H:%M:%S')] $*"; }
ok()   { echo "[$(date '+%H:%M:%S')] ✓ $*"; }
warn() { echo "[$(date '+%H:%M:%S')] ⚠ WARNING: $*"; }
fail() { echo "[$(date '+%H:%M:%S')] ✗ ERROR: $*"; }
banner_fail() {
  echo ""
  echo "################################################################"
  echo "#                                                              #"
  echo "#   ✗ ERROR: $1 FAILED   #"
  echo "#                                                              #"
  echo "################################################################"
  echo ""
}

# ─────────────────────────────────────────────────────────────────────────────
# BANNER + VALIDATION
# ─────────────────────────────────────────────────────────────────────────────
log "======================================================="
log " Security Scan — Pipeline"
log " SHA:    ${GIT_SHA:0:8}"
log " Branch: ${GIT_BRANCH}"
log " Date:   ${RUN_DATE}"
log "======================================================="

REQUIRED=(
  GIT_SHA GIT_BRANCH RUN_DATE
  SONAR_HOST_URL SONAR_TOKEN
  DEFECTDOJO_URL DEFECTDOJO_API_KEY
  DEFECTDOJO_ENGAGEMENT_ID DEFECTDOJO_PRODUCT_ID
)
MISSING=()
for var in "${REQUIRED[@]}"; do
  [ -z "${!var:-}" ] && MISSING+=("$var")
done
if [ ${#MISSING[@]} -gt 0 ]; then
  fail "Missing required variables: ${MISSING[*]}"
  exit 1
fi
ok "All required env vars present"

# ── Clean Secrets (Strip Newlines & Whitespace) ──────────────────────────────
log "Trimming whitespace and newlines from secrets..."
SONAR_TOKEN=$(echo "${SONAR_TOKEN}" | tr -d '\r\n ')
SONAR_HOST_URL=$(echo "${SONAR_HOST_URL}" | tr -d '\r\n ')
DEFECTDOJO_URL=$(echo "${DEFECTDOJO_URL}" | tr -d '\r\n ')
DEFECTDOJO_API_KEY=$(echo "${DEFECTDOJO_API_KEY}" | tr -d '\r\n ')
DEFECTDOJO_ENGAGEMENT_ID=$(echo "${DEFECTDOJO_ENGAGEMENT_ID}" | tr -d '\r\n ')
DEFECTDOJO_PRODUCT_ID=$(echo "${DEFECTDOJO_PRODUCT_ID}" | tr -d '\r\n ')

# ── Normalize URLs ───────────────────────────────────────────────────────────
if [[ ! "${SONAR_HOST_URL}" =~ ^https?:// ]]; then
  log "Normalizing SONAR_HOST_URL to include http://"
  SONAR_HOST_URL="http://${SONAR_HOST_URL}"
fi

if [[ ! "${DEFECTDOJO_URL}" =~ ^https?:// ]]; then
  log "Normalizing DEFECTDOJO_URL to include http://"
  DEFECTDOJO_URL="http://${DEFECTDOJO_URL}"
fi

# ── Check environment ────────────────────────────────────────────────────────
command -v docker &>/dev/null || { fail "Docker not found"; exit 1; }
ok "Docker: $(docker --version | cut -d' ' -f3 | tr -d ',')"

# ── Verify APP_DIR exists ────────────────────────────────────────────────────
if [ ! -d "${APP_DIR}" ]; then
  fail "APP_DIR not found: ${APP_DIR}"
  exit 1
fi
ok "Scanning directory: ${APP_DIR}"
log "Contents of scan root:"
ls -la "${APP_DIR}" | head -30

# ── Fix permissions upfront ──────────────────────────────────────────────────
chmod -R 777 "${REPORTS_DIR}" 2>/dev/null || true
ok "Permissions set on reports directory"

# ── Check DefectDojo ─────────────────────────────────────────────────────────
log "Checking DefectDojo at ${DEFECTDOJO_URL} ..."
DOJO_OK=false
for attempt in 1 2 3; do
  DOJO_HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
    --connect-timeout 15 --max-time 20 \
    "${DEFECTDOJO_URL}" 2>/dev/null || echo "000")
  if [ "${DOJO_HTTP}" != "000" ]; then
    ok "DefectDojo reachable (HTTP ${DOJO_HTTP})"
    DOJO_OK=true
    break
  fi
  warn "DefectDojo attempt ${attempt}/3 failed — retrying in 15s..."
  sleep 15
done
if [ "${DOJO_OK}" = "false" ]; then
  fail "DefectDojo not reachable at ${DEFECTDOJO_URL}"
  exit 1
fi

# ── Check SonarQube (soft) ───────────────────────────────────────────────────
log "Checking SonarQube at ${SONAR_HOST_URL} ..."
SONAR_REACHABLE=false
for attempt in 1 2 3; do
  SONAR_HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
    --connect-timeout 15 --max-time 20 \
    "${SONAR_HOST_URL}" 2>/dev/null || echo "000")
  if [ "${SONAR_HTTP}" != "000" ]; then
    ok "SonarQube reachable (HTTP ${SONAR_HTTP})"
    SONAR_REACHABLE=true
    break
  fi
  warn "SonarQube attempt ${attempt}/3 — retrying in 15s..."
  sleep 15
done
[ "${SONAR_REACHABLE}" = "false" ] && \
  warn "SonarQube not reachable — SAST skipped"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1 — SonarQube Project Setup & SAST
# ─────────────────────────────────────────────────────────────────────────────
log "-------------------------------------------------------"
log "STEP 1: SonarQube Project Setup & SAST"
log "-------------------------------------------------------"

if [ "${SONAR_REACHABLE}" = "true" ]; then
  cd "${APP_DIR}"

  log "Determining SonarQube project identity..."
  PKG_JSON=""
  if [ -f "package.json" ]; then
    PKG_JSON="package.json"
  elif [ -n "$(find . -maxdepth 2 -name "package.json" ! -path "*/node_modules/*" | head -1)" ]; then
    PKG_JSON=$(find . -maxdepth 2 -name "package.json" ! -path "*/node_modules/*" | head -1)
  fi

  if [ -n "${PKG_JSON}" ]; then
    log "Found package.json at: ${PKG_JSON}"
    PROJECT_NAME=$(grep -m 1 '"name":' "${PKG_JSON}" | cut -d'"' -f4 || echo "unknown-project")
  else
    warn "No package.json found — using repository name as project name"
    PROJECT_NAME=$(basename "${APP_DIR}")
  fi
  
  SONAR_PROJECT_KEY=$(echo "${PROJECT_NAME}" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9._:-]/-/g')
  ok "Derived SonarQube project name: ${PROJECT_NAME}, key: ${SONAR_PROJECT_KEY}"

  # --- Skip Project Creation if Token lacks Admin rights (Graceful 401/403) ---
  log "Checking if project '${SONAR_PROJECT_KEY}' exists in SonarQube..."
  # Use curl with || true to prevent script from exiting on 401
  PROJECT_SEARCH_RESP=$(curl -s -u "${SONAR_TOKEN}:" \
    "${SONAR_HOST_URL}/api/projects/search?projects=${SONAR_PROJECT_KEY}" || echo "REACH_ERROR")
  
  PROJECT_EXISTS=$(echo "${PROJECT_SEARCH_RESP}" | grep -q "\"key\":\"${SONAR_PROJECT_KEY}\"" && echo "true" || echo "false")

  if [ "${PROJECT_EXISTS}" = "false" ] && [ "${PROJECT_SEARCH_RESP}" != "REACH_ERROR" ]; then
    log "Project not found. Auto-creating '${SONAR_PROJECT_KEY}'..."
    CREATE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -u "${SONAR_TOKEN}:" -X POST \
      "${SONAR_HOST_URL}/api/projects/create" \
      -d "name=${PROJECT_NAME}" \
      -d "project=${SONAR_PROJECT_KEY}" || echo "000")
    
    if [ "${CREATE_STATUS}" = "200" ] || [ "${CREATE_STATUS}" = "201" ]; then
      ok "Project created successfully (HTTP ${CREATE_STATUS})"
    else
      warn "Could not create project (HTTP ${CREATE_STATUS}) — likely missing Admin permissions. Proceeding with scan anyway..."
    fi
  else
    ok "Project '${SONAR_PROJECT_KEY}' existence confirmed or search skipped"
  fi

  SONAR_OK=false

  log "Running SonarScanner via NPX to avoid Docker pulls..."
  npx --yes sonar-scanner \
    -Dsonar.projectKey="${SONAR_PROJECT_KEY}" \
    -Dsonar.projectName="${PROJECT_NAME}" \
    -Dsonar.host.url="${SONAR_HOST_URL}" \
    -Dsonar.token="${SONAR_TOKEN}" \
    -Dsonar.sources=. \
    -Dsonar.exclusions="**/node_modules/**,**/dist/**,**/build/**,**/coverage/**,**/tests/**,**/seeds/**,**/scripts/**,**/.git/**" \
    -Dsonar.sourceEncoding=UTF-8 \
    2>&1 && SONAR_OK=true || SONAR_OK=false

  if [ "${SONAR_OK}" = "true" ]; then
    log "Waiting 30s for SonarQube to process analysis..."
    sleep 30

    log "Polling SonarQube background task..."
    for i in $(seq 1 12); do
      RAW_RESP=$(curl -s -u "${SONAR_TOKEN}:" \
        "${SONAR_HOST_URL}/api/ce/component?component=${SONAR_PROJECT_KEY}")
      STATUS=$(echo "${RAW_RESP}" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "")
      if [ -z "${STATUS}" ]; then
        STATUS="UNKNOWN"
        log "  Raw API response: ${RAW_RESP}"
      fi
      log "  Task status: ${STATUS} (attempt ${i}/12)"
      [ "${STATUS}" = "SUCCESS" ] && break
      [ "${STATUS}" = "FAILED" ] && { warn "SonarQube background task FAILED"; break; }
      sleep 10
    done

    QG_FAILED=false
    if [ "${STATUS}" = "SUCCESS" ]; then
      log "Checking SonarQube Quality Gate status..."
      # Give Elasticsearch/Quality Gate engine a few seconds to finalize
      sleep 5 
      QG_RESP=$(curl -s -u "${SONAR_TOKEN}:" \
        "${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}")
      QG_STATUS=$(echo "${QG_RESP}" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "UNKNOWN")
      
      if [ "${QG_STATUS}" = "OK" ]; then
        ok "Quality Gate Passed (Status: ${QG_STATUS})"
        SONAR_RESULT="passed"
      else
        warn "Quality Gate FAILED (Status: ${QG_STATUS})"
        log "  Raw Quality Gate API Response: ${QG_RESP}"
        SONAR_RESULT="failed (quality gate)"
        QG_FAILED=true
      fi
    else
      warn "SonarQube background task did not reach SUCCESS. Status: ${STATUS}"
      SONAR_RESULT="failed (task incomplete)"
    fi

    curl -s \
      -u "${SONAR_TOKEN}:" \
      "${SONAR_HOST_URL}/api/issues/search?componentKeys=${SONAR_PROJECT_KEY}&resolved=false&ps=500" \
      -o "${REPORTS_DIR}/sonarqube-report.json"
    SIZE=$(wc -c < "${REPORTS_DIR}/sonarqube-report.json" 2>/dev/null || echo 0)

    if [ "${SIZE}" -gt 500 ]; then
      ok "SonarQube report saved (${SIZE} bytes)"
      [ "${QG_FAILED}" != "true" ] && SONAR_RESULT="passed"
    else
      warn "SonarQube report too small (${SIZE} bytes) — likely empty or error"
      warn "Raw: $(cat "${REPORTS_DIR}/sonarqube-report.json" 2>/dev/null || echo 'unreadable')"
      SONAR_RESULT="partial"
    fi
  else
    banner_fail "SONARQUBE SCAN"
    SONAR_RESULT="failed"
  fi
else
  warn "Skipping SonarQube — not reachable"
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2 — Unit Testing
# ─────────────────────────────────────────────────────────────────────────────
log "-------------------------------------------------------"
log "STEP 2: Unit Testing"
log "-------------------------------------------------------"
cd "${APP_DIR}"

# ── Detect package manager ───────────────────────────────────────────────────
PKG_MANAGER="npm"
if [ -f "pnpm-lock.yaml" ]; then PKG_MANAGER="pnpm"
elif [ -f "yarn.lock" ]; then PKG_MANAGER="yarn"
elif [ -f "bun.lockb" ]; then PKG_MANAGER="bun"
fi
ok "Detected package manager: ${PKG_MANAGER}"

# ── Ensure package manager is installed ─────────────────────────────────────
if [ "${PKG_MANAGER}" = "pnpm" ] && ! command -v pnpm &>/dev/null; then
  log "pnpm not found — installing via npm..."
  npm install -g pnpm --silent
  ok "pnpm installed: $(pnpm --version)"
fi
if [ "${PKG_MANAGER}" = "yarn" ] && ! command -v yarn &>/dev/null; then
  log "yarn not found — installing via npm..."
  npm install -g yarn --silent
  ok "yarn installed: $(yarn --version)"
fi

# ── Install dependencies (with timeout + visible output on failure) ──────────
log "Installing dependencies with ${PKG_MANAGER}..."
INSTALL_OK=false

# Detect monorepo (pnpm-workspace.yaml or workspaces in package.json)
IS_MONOREPO=false
if [ -f "pnpm-workspace.yaml" ] || [ -f "pnpm-workspace.yml" ]; then
  IS_MONOREPO=true
  log "Monorepo detected (pnpm workspace)"
elif node -e "try{const p=require('./package.json');process.exit(p.workspaces?0:1)}catch(e){process.exit(1)}" 2>/dev/null; then
  IS_MONOREPO=true
  log "Monorepo detected (package.json workspaces)"
fi

case "${PKG_MANAGER}" in
  pnpm)
    if [ "${IS_MONOREPO}" = "true" ]; then
      # In monorepo: install from root, ignore scripts to avoid hanging postinstalls
      timeout 300 pnpm install --no-frozen-lockfile --ignore-scripts 2>&1 \
        && INSTALL_OK=true \
        || { warn "pnpm install failed"; INSTALL_OK=false; }
    else
      timeout 300 pnpm install --no-frozen-lockfile --ignore-scripts 2>&1 \
        && INSTALL_OK=true \
        || { warn "pnpm install failed"; INSTALL_OK=false; }
    fi
    ;;
  yarn)
    timeout 300 yarn install --frozen-lockfile --non-interactive --ignore-scripts 2>&1 \
      && INSTALL_OK=true \
      || timeout 300 yarn install --non-interactive --ignore-scripts 2>&1 \
      && INSTALL_OK=true \
      || { warn "yarn install failed"; INSTALL_OK=false; }
    ;;
  bun)
    timeout 300 bun install --ignore-scripts 2>&1 \
      && INSTALL_OK=true \
      || { warn "bun install failed"; INSTALL_OK=false; }
    ;;
  npm)
    timeout 300 npm ci --ignore-scripts 2>&1 \
      && INSTALL_OK=true \
      || timeout 300 npm install --no-audit --no-fund --ignore-scripts 2>&1 \
      && INSTALL_OK=true \
      || { warn "npm install failed"; INSTALL_OK=false; }
    ;;
esac

if [ "${INSTALL_OK}" = "true" ]; then
  ok "Dependencies installed"
else
  warn "Dependency install failed — unit tests may fail or be skipped"
fi

# ── Detect test script ───────────────────────────────────────────────────────
HAS_TEST_SMOKE=$(node -e "try{const p=require('./package.json');process.stdout.write(p.scripts&&p.scripts['test:smoke']?'yes':'no')}catch(e){process.stdout.write('no')}" 2>/dev/null)
HAS_TEST=$(node -e "try{const p=require('./package.json');process.stdout.write(p.scripts&&p.scripts['test']?'yes':'no')}catch(e){process.stdout.write('no')}" 2>/dev/null)

# ── Run tests (with 10-min timeout to prevent hanging) ──────────────────────
UNIT_RESULT="skipped"
if [ "${HAS_TEST_SMOKE}" = "yes" ]; then
  log "Running 'test:smoke' script..."
  if timeout 600 ${PKG_MANAGER} run test:smoke 2>&1; then
    ok "Smoke tests passed"
    UNIT_RESULT="passed"
  else
    EXIT_CODE=$?
    if [ ${EXIT_CODE} -eq 124 ]; then
      warn "Tests timed out after 10 minutes"
      UNIT_RESULT="timed out"
    else
      banner_fail "UNIT TESTS"
      UNIT_RESULT="failed"
    fi
  fi
elif [ "${HAS_TEST}" = "yes" ]; then
  log "Running 'test' script..."
  # Pass CI=true to prevent watch mode in Jest/Vitest
  if timeout 600 env CI=true ${PKG_MANAGER} run test 2>&1; then
    ok "Unit tests passed"
    UNIT_RESULT="passed"
  else
    EXIT_CODE=$?
    if [ ${EXIT_CODE} -eq 124 ]; then
      warn "Tests timed out after 10 minutes"
      UNIT_RESULT="timed out"
    else
      banner_fail "UNIT TESTS"
      UNIT_RESULT="failed"
    fi
  fi
else
  warn "No 'test' or 'test:smoke' script found in package.json — skipping unit tests"
  UNIT_RESULT="skipped (no script)"
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3 — API Integration Testing (Newman)
# ─────────────────────────────────────────────────────────────────────────────
log "-------------------------------------------------------"
log "STEP 3: API Integration Testing (Newman)"
log "-------------------------------------------------------"
cd "${APP_DIR}"

# ── Detect start command ─────────────────────────────────────────────────────
HAS_START=$(node -e "try{const p=require('./package.json');process.stdout.write(p.scripts&&p.scripts['start']?'yes':'no')}catch(e){process.stdout.write('no')}" 2>/dev/null)
HAS_DEV=$(node -e "try{const p=require('./package.json');process.stdout.write(p.scripts&&p.scripts['dev']?'yes':'no')}catch(e){process.stdout.write('no')}" 2>/dev/null)
HAS_NEWMAN=$(node -e "try{const p=require('./package.json');process.stdout.write(p.scripts&&p.scripts['test:newman']?'yes':'no')}catch(e){process.stdout.write('no')}" 2>/dev/null)

# Check if Postman collections exist
COLLECTIONS=$(find . -not -path "*/node_modules/*" -not -path "*/.git/*" -name "*.postman_collection.json" 2>/dev/null)

# ZAP always runs if app starts; Newman only runs if collections/keys present
if true; then
  # ── Start the app (monorepo-aware) ──────────────────────────────────────────
  APP_PID=""

  # In a monorepo, find the web/frontend app directory to start
  APP_START_DIR="${APP_DIR}"
  if [ "${IS_MONOREPO}" = "true" ]; then
    for CANDIDATE in apps/web apps/frontend packages/web web frontend; do
      if [ -f "${APP_DIR}/${CANDIDATE}/package.json" ]; then
        HAS_CANDIDATE_START=$(node -e "try{const p=require('${APP_DIR}/${CANDIDATE}/package.json');process.stdout.write(p.scripts&&(p.scripts.start||p.scripts.dev)?'yes':'no')}catch(e){process.stdout.write('no')}" 2>/dev/null)
        if [ "${HAS_CANDIDATE_START}" = "yes" ]; then
          log "Monorepo: will start app from ${CANDIDATE}"
          APP_START_DIR="${APP_DIR}/${CANDIDATE}"
          HAS_START=$(node -e "try{const p=require('${APP_START_DIR}/package.json');process.stdout.write(p.scripts&&p.scripts.start?'yes':'no')}catch(e){process.stdout.write('no')}" 2>/dev/null)
          HAS_DEV=$(node -e "try{const p=require('${APP_START_DIR}/package.json');process.stdout.write(p.scripts&&p.scripts.dev?'yes':'no')}catch(e){process.stdout.write('no')}" 2>/dev/null)
          break
        fi
      fi
    done
  fi

  # ── Smart start: read package.json scripts and pick the best one ────────────
  # Priority: dev > start:dev > start:local > serve > start (with build if Next.js)
  CHOSEN_SCRIPT=""
  NEEDS_BUILD=false

  SCRIPTS_JSON=$(node -e "
    try {
      const p = require('${APP_START_DIR}/package.json');
      const s = p.scripts || {};
      const priority = ['dev','start:dev','start:local','start:ci','serve','start'];
      for (const k of priority) {
        if (s[k]) { process.stdout.write(k); break; }
      }
    } catch(e) {}
  " 2>/dev/null)

  CHOSEN_SCRIPT="${SCRIPTS_JSON}"

  if [ -z "${CHOSEN_SCRIPT}" ]; then
    warn "No runnable script found in ${APP_START_DIR}/package.json — skipping Newman and ZAP"
    NEWMAN_RESULT="skipped (no start script)"
    ZAP_RESULT="skipped"
  else
    log "Selected start script: '${CHOSEN_SCRIPT}' from ${APP_START_DIR}/package.json"

    # If chosen script is 'start' and this is a Next.js app, run build first
    IS_NEXTJS=false
    for CFG in next.config.js next.config.ts next.config.mjs next.config.cjs; do
      [ -f "${APP_START_DIR}/${CFG}" ] && IS_NEXTJS=true && break
    done

    if [ "${CHOSEN_SCRIPT}" = "start" ] && [ "${IS_NEXTJS}" = "true" ]; then
      log "Next.js detected with 'start' script — running 'next build' first..."
      if timeout 300 (cd "${APP_START_DIR}" && ${PKG_MANAGER} run build) 2>&1; then
        ok "Next.js build completed"
      else
        warn "Next.js build failed — ZAP scan may not work correctly"
      fi
    fi

    log "Starting app from ${APP_START_DIR} with: ${PKG_MANAGER} run ${CHOSEN_SCRIPT}"
    (cd "${APP_START_DIR}" && ${PKG_MANAGER} run ${CHOSEN_SCRIPT}) </dev/null > /tmp/ci-app.log 2>&1 &
    APP_PID=$!
  fi

  if [ -n "${APP_PID}" ]; then
    log "Waiting up to 90s for app to be ready on http://localhost:3000..."
    APP_READY=false
    for i in $(seq 1 45); do
      if ! kill -0 ${APP_PID} 2>/dev/null; then
        warn "App process exited early. Logs:"
        cat /tmp/ci-app.log 2>/dev/null || true
        break
      fi
      if curl -s --connect-timeout 2 --max-time 3 http://localhost:3000 > /dev/null 2>&1; then
        APP_READY=true
        break
      fi
      sleep 2
    done

    if [ "${APP_READY}" = "true" ]; then
      ok "Application is ready."

      # ── Newman ──────────────────────────────────────────────────────────────
      if [ -n "${POSTMAN_API_KEY:-}" ] && [ -n "${COLLECTION_UID:-}" ]; then
        log "Running Newman via test:newman script..."
        if timeout 300 ${PKG_MANAGER} run test:newman 2>&1; then
          ok "Newman tests passed"
          NEWMAN_RESULT="passed"
        else
          banner_fail "NEWMAN API TESTS"
          NEWMAN_RESULT="failed"
        fi
      elif [ "${HAS_NEWMAN}" = "yes" ]; then
        log "Running local Newman test:newman script..."
        if timeout 300 ${PKG_MANAGER} run test:newman 2>&1; then
          ok "Newman tests passed"
          NEWMAN_RESULT="passed"
        else
          banner_fail "NEWMAN API TESTS"
          NEWMAN_RESULT="failed"
        fi
      else
        warn "Missing POSTMAN_API_KEY/COLLECTION_UID and no test:newman script — skipping Newman"
        NEWMAN_RESULT="skipped (missing keys)"
      fi

      # ── OWASP ZAP ───────────────────────────────────────────────────────────
      log "-------------------------------------------------------"
      log "STEP 4: OWASP ZAP DAST Scan"
      log "-------------------------------------------------------"
      chmod 777 "${REPORTS_DIR}"
      docker run --rm --network=host \
        -v "${REPORTS_DIR}:/zap/wrk/:rw" \
        ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
        -t http://localhost:3000 \
        -x zap-report.xml || true

      if [ -f "${REPORTS_DIR}/zap-report.xml" ] && [ "$(wc -c < "${REPORTS_DIR}/zap-report.xml")" -gt 100 ]; then
        ok "ZAP Scan completed ($(wc -c < "${REPORTS_DIR}/zap-report.xml") bytes)."
        ZAP_RESULT="completed"
      else
        warn "ZAP Scan failed to produce a valid report."
        ZAP_RESULT="failed"
      fi
    else
      warn "Application failed to start within 30s. Skipping Newman and ZAP."
      warn "App logs:"
      cat /tmp/ci-app.log 2>/dev/null || true
      NEWMAN_RESULT="failed (app not ready)"
      ZAP_RESULT="skipped"
    fi

    log "Shutting down the application..."
    kill ${APP_PID} 2>/dev/null || true
  fi
fi
cd "${WORKSPACE}"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 5 — Import to DefectDojo
# ─────────────────────────────────────────────────────────────────────────────
log "-------------------------------------------------------"
log "STEP 5: Importing to DefectDojo"
log "-------------------------------------------------------"

do_import() {
  local FILE="$1" SCAN_TYPE="$2" LABEL="$3"
  if [ ! -f "${FILE}" ]; then
    warn "Skipping ${LABEL} — file not found: ${FILE}"
    return 1
  fi
  log "Importing ${LABEL} ($(wc -c < "${FILE}") bytes)..."
  local RESPONSE HTTP_CODE BODY
  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Authorization: Token ${DEFECTDOJO_API_KEY}" \
    -F "scan_date=${RUN_DATE}" \
    -F "scan_type=${SCAN_TYPE}" \
    -F "engagement=${DEFECTDOJO_ENGAGEMENT_ID}" \
    -F "file=@${FILE}" \
    -F "close_old_findings=true" \
    -F "minimum_severity=Low" \
    -F "tags=git-sha:${GIT_SHA:0:8},branch:${GIT_BRANCH},date:${RUN_DATE}" \
    "${DEFECTDOJO_URL}/api/v2/import-scan/")
  HTTP_CODE=$(echo "${RESPONSE}" | tail -1)
  BODY=$(echo "${RESPONSE}" | head -n -1)
  if [ "${HTTP_CODE}" = "201" ]; then
    ok "${LABEL} imported (HTTP 201)"
    IMPORT_COUNT=$((IMPORT_COUNT + 1))
    return 0
  else
    warn "${LABEL} import failed (HTTP ${HTTP_CODE})"
    warn "Response: ${BODY}"
    return 1
  fi
}

do_import \
  "${REPORTS_DIR}/sonarqube-report.json" \
  "SonarQube Scan" \
  "SonarQube" || true

do_import \
  "${REPORTS_DIR}/zap-report.xml" \
  "ZAP Scan" \
  "OWASP ZAP" || true

if [ "${IMPORT_COUNT}" -eq 0 ]; then
  warn "DefectDojo import failed — pipeline will continue and bundle raw reports"
  warn "Check:"
  warn "  1. DEFECTDOJO_API_KEY — must be the key value only (no 'Token ' prefix)"
  warn "  2. DEFECTDOJO_ENGAGEMENT_ID — must be a valid numeric ID"
  warn "  3. DEFECTDOJO_URL — e.g. http://your-host:8080"
  DOJO_IMPORT_FAILED=true
else
  ok "${IMPORT_COUNT} reports imported to DefectDojo"
  DOJO_IMPORT_FAILED=false
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP 6 — Generate final report from DefectDojo (or bundle raw reports)
# ─────────────────────────────────────────────────────────────────────────────
log "-------------------------------------------------------"
log "STEP 6: Generating final report"
log "-------------------------------------------------------"

if [ "${DOJO_IMPORT_FAILED}" = "true" ]; then
  warn "DefectDojo unavailable — bundling raw scan reports as final output"

  SONAR_SIZE=$(wc -c < "${REPORTS_DIR}/sonarqube-report.json" 2>/dev/null || echo 0)

  cat > "${REPORTS_DIR}/final-report.json" <<EOF
{
  "scan_summary": {
    "sha": "${GIT_SHA:0:8}",
    "branch": "${GIT_BRANCH}",
    "date": "${RUN_DATE}",
    "sonarqube_result": "${SONAR_RESULT}",
    "unit_tests_result": "${UNIT_RESULT}",
    "newman_tests_result": "${NEWMAN_RESULT}",
    "zap_result": "${ZAP_RESULT}",
    "defectdojo_import": "failed",
    "note": "DefectDojo import failed. Raw reports are included in this artifact.",
    "raw_reports": {
      "sonarqube_report_bytes": ${SONAR_SIZE},
      "zap_report_bytes": $(wc -c < "${REPORTS_DIR}/zap-report.xml" 2>/dev/null || echo 0)
    }
  }
}
EOF
  ok "Summary JSON written — raw reports also available in artifact"
  FINAL_FORMAT="json"

else
  sleep 15

  log "Fetching findings from DefectDojo..."
  HTTP=$(curl -s \
    -o "${REPORTS_DIR}/final-report.json" \
    -w "%{http_code}" \
    -H "Authorization: Token ${DEFECTDOJO_API_KEY}" \
    "${DEFECTDOJO_URL}/api/v2/findings/?engagement=${DEFECTDOJO_ENGAGEMENT_ID}&limit=500")
  SIZE=$(wc -c < "${REPORTS_DIR}/final-report.json" 2>/dev/null || echo 0)

  if [ "${HTTP}" = "200" ] && [ "${SIZE}" -gt 10 ]; then
    ok "DefectDojo findings report generated (${SIZE} bytes)"
    
    # Merge scan_summary into the fetched findings so HTML report shows both
    if command -v jq &>/dev/null; then
      log "Merging pipeline summary into findings..."
      TEMP_JSON="${REPORTS_DIR}/temp-findings.json"
      cp "${REPORTS_DIR}/final-report.json" "${TEMP_JSON}"
      jq --arg sha "${GIT_SHA:0:8}" \
         --arg branch "${GIT_BRANCH}" \
         --arg date "${RUN_DATE}" \
         --arg sonar "${SONAR_RESULT}" \
         --arg unit "${UNIT_RESULT}" \
         --arg newman "${NEWMAN_RESULT}" \
         --arg zap "${ZAP_RESULT}" \
         '. + {scan_summary: {sha: $sha, branch: $branch, date: $date, sonarqube_result: $sonar, unit_tests_result: $unit, newman_tests_result: $newman, zap_result: $zap}}' \
         "${TEMP_JSON}" > "${REPORTS_DIR}/final-report.json"
      rm "${TEMP_JSON}"
    fi

    FINAL_FORMAT="json"
  else
    warn "DefectDojo report fetch failed (HTTP ${HTTP}, ${SIZE} bytes) — falling back to raw bundle"
    cat > "${REPORTS_DIR}/final-report.json" <<EOF
{
  "scan_summary": {
    "sha": "${GIT_SHA:0:8}",
    "branch": "${GIT_BRANCH}",
    "date": "${RUN_DATE}",
    "sonarqube_result": "${SONAR_RESULT}",
    "unit_tests_result": "${UNIT_RESULT}",
    "newman_tests_result": "${NEWMAN_RESULT}",
    "zap_result": "${ZAP_RESULT}",
    "defectdojo_import": "imported_but_report_fetch_failed",
    "note": "Raw reports are included in this artifact."
  }
}
EOF
    ok "Fallback summary JSON written"
    FINAL_FORMAT="json"
  fi
fi

log "-------------------------------------------------------"
log "STEP 5: Generating HTML Report"
log "-------------------------------------------------------"
if command -v node &>/dev/null; then
  if [ -f "${WORKSPACE}/scripts/generate-html.js" ] && [ -f "${REPORTS_DIR}/final-report.json" ]; then
    node "${WORKSPACE}/scripts/generate-html.js" "${REPORTS_DIR}/final-report.json" "${REPORTS_DIR}/final-report.html"
    if [ -f "${REPORTS_DIR}/final-report.html" ]; then
      FINAL_FORMAT="json + html"
    else
      warn "Failed to generate HTML report."
    fi
  else
    warn "Missing final-report.json or generate-html.js script. Skipping HTML generation."
  fi
else
  warn "Node.js not installed on runner. Skipping HTML generation."
fi

log ""
log "Reports directory contents:"
ls -lh "${REPORTS_DIR}" || true

# ─────────────────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────────────────
log ""
log "======================================================="
log " SCAN COMPLETE"
log " SHA: ${GIT_SHA:0:8}  Branch: ${GIT_BRANCH}"
log "-------------------------------------------------------"
log " SonarQube SAST:      ${SONAR_RESULT:-skipped}"
log " Unit Tests:         ${UNIT_RESULT}"
log " Newman API Tests:   ${NEWMAN_RESULT}"
log " OWASP ZAP DAST:      ${ZAP_RESULT}"
log " DefectDojo imports: ${IMPORT_COUNT}"
log " Report format:      ${FINAL_FORMAT}"
log " Report:             ${REPORTS_DIR}/final-report.${FINAL_FORMAT}"
log "======================================================="
ok "Done. Report will be uploaded as GitHub artifact."

if [ "${QG_FAILED:-false}" = "true" ]; then
  log ""
  fail "TERMINAL ERROR: SonarQube Quality Gate Failed"
  fail "The pipeline is blocked from passing because security/quality conditions were not met."
  exit 1
fi
