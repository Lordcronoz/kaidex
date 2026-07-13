"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient, getSessionToken, ApiClientError } from "@/lib/api-client";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * React hook for fetching data from the NestJS API.
 * Automatically handles loading, error, and refetch states.
 */
export function useApi<T = any>(path: string | null): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const token = await getSessionToken();
        const result = await apiClient.get<T>(path!, token);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiClientError) {
            setError(err.message);
          } else {
            setError("Failed to fetch data");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [path, refreshKey]);

  return { data, loading, error, refetch };
}

/**
 * Helper to perform mutations (POST, PATCH, DELETE) with error handling.
 */
export function useApiMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async <T = any>(
      method: "post" | "patch" | "delete",
      path: string,
      body?: any,
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const token = await getSessionToken();
        const result = await apiClient[method]<T>(path, body, token);
        return result;
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError("Operation failed");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { mutate, loading, error };
}
