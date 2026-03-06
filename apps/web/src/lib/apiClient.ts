export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

async function fetchWrapper(endpoint: string, options: RequestOptions = {}) {
  const { params, ...init } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API request failed");
  }

  return response.json();
}

export const apiClient = {
  get: (endpoint: string, options?: RequestOptions) =>
    fetchWrapper(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: (endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchWrapper(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: (endpoint: string, options?: RequestOptions) =>
    fetchWrapper(endpoint, { ...options, method: "DELETE" }),
};
