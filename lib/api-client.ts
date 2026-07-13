/**
 * Centralized API client for communicating with the NestJS backend.
 * Automatically attaches the JWT token from the session.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  timestamp: string;
}

interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

class ApiClientError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(response: ApiError) {
    super(response.message);
    this.name = 'ApiClientError';
    this.statusCode = response.statusCode;
    this.errors = response.errors;
  }
}

async function getSessionToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/session');
    if (!res.ok) return null;
    const session = await res.json();
    return session?.accessToken || null;
  } catch {
    return null;
  }
}

async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new ApiClientError(json as ApiError);
  }

  // Unwrap the standard envelope
  return (json as ApiResponse<T>).data;
}

export const apiClient = {
  get: <T = any>(path: string, token?: string | null) =>
    apiRequest<T>(path, { method: 'GET' }, token),

  post: <T = any>(path: string, body: any, token?: string | null) =>
    apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),

  patch: <T = any>(path: string, body?: any, token?: string | null) =>
    apiRequest<T>(
      path,
      { method: 'PATCH', ...(body && { body: JSON.stringify(body) }) },
      token,
    ),

  delete: <T = any>(path: string, token?: string | null) =>
    apiRequest<T>(path, { method: 'DELETE' }, token),
};

export { ApiClientError, getSessionToken };
export type { ApiResponse, ApiError };
