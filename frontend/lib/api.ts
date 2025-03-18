type FetchOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number };
};

const API_BASE_URL = "http://localhost:8000/api";

export async function fetchApi(
  endpoint: string,
  token: string | null,
  options: FetchOptions = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers,
    cache: options.cache,
    next: options.next,
    credentials: "include", // Important for cookies
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API error: ${response.status}`);
  }

  return response.json();
}
