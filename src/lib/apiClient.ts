/**
 * apiClient — always calls through the Next.js proxy (/api/...)
 * The proxy forwards the request to the backend and injects the auth token server-side.
 *
 * Usage:
 *   apiClient.get("/banners")
 *   apiClient.post("/banners/upload", formData)
 *   apiClient.put("/banners/123", { order: 2 })
 *   apiClient.delete("/banners/123")
 */

type ApiResponse<T = unknown> = Promise<T>;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

function buildHeaders(body?: unknown): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // Don't set Content-Type for FormData — browser sets it with boundary
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

async function request<T>(method: string, path: string, body?: unknown): ApiResponse<T> {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const res = await fetch(`/api/${cleanPath}`, {
    method,
    headers: buildHeaders(body),
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
        ? body
        : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string }).message
        : String(data);
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return data as T;
}

export const apiClient = {
  get: <T = unknown>(path: string) => request<T>("GET", path),
  post: <T = unknown>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T = unknown>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T = unknown>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T = unknown>(path: string) => request<T>("DELETE", path),
};
