import { NextRequest, NextResponse } from "next/server";
import type {
  DataAxlePeopleSearchBody,
  DataAxlePeopleSearchResponse,
} from "./types";

const DATA_AXLE_SEARCH_URL = "https://api.data-axle.com/v1/people/search";

/** Data Axle requires 'packages' or 'fields'. Trial includes Core v1. */
const DEFAULT_PACKAGES = ["core_v1"];

const ensurePackagesOrFields = (body: DataAxlePeopleSearchBody): void => {
  const hasPackages = Array.isArray(body.packages) && body.packages.length > 0;
  const hasFields = Array.isArray(body.fields) && body.fields.length > 0;
  if (!hasPackages && !hasFields) {
    body.packages = DEFAULT_PACKAGES;
  }
};

/**
 * GET /api/data-axle/people
 * Simple test with URL params: ?query=Smith&limit=5&state=CA
 * Uses a basic equals filter when state (or other simple params) are provided.
 */
export async function GET(request: NextRequest) {
  const authToken = process.env.DATA_AXLE_AUTH_TOKEN;
  if (!authToken) {
    return NextResponse.json(
      {
        error: "DATA_AXLE_AUTH_TOKEN is not set. Add it to .env.local.",
      },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";
  const limit = Math.min(
    Math.max(0, parseInt(searchParams.get("limit") ?? "10", 10)),
    400,
  );
  const offset = Math.min(
    Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10)),
    4000,
  );
  const state = searchParams.get("state");
  const zip = searchParams.get("zip");
  const fieldsParam = searchParams.get("fields");

  const body: DataAxlePeopleSearchBody = {
    query: query || undefined,
    limit,
    offset: offset || undefined,
    fields: fieldsParam
      ? fieldsParam.split(",").map((f) => f.trim())
      : undefined,
  };

  if (state) {
    body.filter = {
      relation: "equals",
      attribute: "state",
      value: state,
    };
  } else if (zip) {
    body.filter = {
      relation: "equals",
      attribute: "zip",
      value: zip,
    };
  }

  ensurePackagesOrFields(body);

  const hasBody = !!body.filter;
  const res = hasBody
    ? await fetch(DATA_AXLE_SEARCH_URL, {
        method: "POST",
        headers: {
          "X-AUTH-TOKEN": authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    : await fetch(
        `${DATA_AXLE_SEARCH_URL}?${new URLSearchParams({
          ...(body.query && { query: body.query }),
          limit: String(body.limit ?? 10),
          ...(body.offset !== undefined &&
            body.offset > 0 && { offset: String(body.offset) }),
          ...(body.fields?.length
            ? { fields: body.fields.join(",") }
            : { packages: body.packages!.join(",") }),
        }).toString()}`,
        {
          method: "GET",
          headers: { "X-AUTH-TOKEN": authToken },
        },
      );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      {
        error: "Data Axle API error",
        status: res.status,
        detail: text,
      },
      { status: res.status >= 500 ? 502 : res.status },
    );
  }

  const data = (await res.json()) as DataAxlePeopleSearchResponse;
  return NextResponse.json(data);
}

/**
 * POST /api/data-axle/people
 * Full search with JSON body: query, filter (Filter DSL), limit, offset, fields, etc.
 * @see https://platform.data-axle.com/people/docs/search_api
 * @see https://platform.data-axle.com/people/docs/filter_dsl
 */
export async function POST(request: NextRequest) {
  const authToken = process.env.DATA_AXLE_AUTH_TOKEN;
  if (!authToken) {
    return NextResponse.json(
      {
        error: "DATA_AXLE_AUTH_TOKEN is not set. Add it to .env.local.",
      },
      { status: 503 },
    );
  }

  let body: DataAxlePeopleSearchBody;
  try {
    body = (await request.json()) as DataAxlePeopleSearchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.limit !== undefined) {
    body.limit = Math.min(Math.max(0, body.limit), 400);
  }
  if (body.offset !== undefined) {
    body.offset = Math.min(Math.max(0, body.offset), 4000);
  }

  ensurePackagesOrFields(body);

  const res = await fetch(DATA_AXLE_SEARCH_URL, {
    method: "POST",
    headers: {
      "X-AUTH-TOKEN": authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      {
        error: "Data Axle API error",
        status: res.status,
        detail: text,
      },
      { status: res.status >= 500 ? 502 : res.status },
    );
  }

  const data = (await res.json()) as DataAxlePeopleSearchResponse;
  return NextResponse.json(data);
}
