import httpx

BASE_URL = "http://localhost:8000/api"


def test_auth():
    email = "test@example.com"
    password = "password123"

    print("--- Testing Registration ---")
    try:
        resp = httpx.post(
            f"{BASE_URL}/auth/register",
            json={"email": email, "password": password},
        )
        print(f"Status: {resp.status_code}")
        print(f"Data: {resp.json()}")
        if resp.status_code == 200:
            tokens = resp.json()
            access_token = tokens["access_token"]
            refresh_token = tokens["refresh_token"]
        else:
            print("Registration failed, searching for user if exists...")
            # If already exists, try login
    except Exception as e:
        print(f"Error during registration: {e}")

    print("\n--- Testing Login ---")
    try:
        resp = httpx.post(
            f"{BASE_URL}/auth/login",
            json={"email": email, "password": password},
        )
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            tokens = resp.json()
            access_token = tokens["access_token"]
            refresh_token = tokens["refresh_token"]
            print("Login successful!")
        else:
            print(f"Login failed: {resp.text}")
            return
    except Exception as e:
        print(f"Error during login: {e}")
        return

    print("\n--- Testing Protected Route (/api/lead-search) ---")
    try:
        mock_search = {
            "networth_min": 100000,
            "networth_max": 500000,
            "age_min": 30,
            "age_max": 50,
            "zip_codes": ["90210"],
            "limit": 10,
        }
        headers = {"Authorization": f"Bearer {access_token}"}
        resp = httpx.post(f"{BASE_URL}/lead-search", json=mock_search, headers=headers)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Protected route accessed successfully!")
        else:
            print(f"Protected route failed: {resp.text}")
    except Exception as e:
        print(f"Error during search: {e}")

    print("\n--- Testing Refresh Token ---")
    try:
        resp = httpx.post(
            f"{BASE_URL}/auth/refresh",
            params={"refresh_token": refresh_token},
        )
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Token refresh successful!")
        else:
            print(f"Refresh failed: {resp.text}")
    except Exception as e:
        print(f"Error during refresh: {e}")


if __name__ == "__main__":
    test_auth()
