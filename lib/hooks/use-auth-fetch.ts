"use client";

import { useAuth } from "@/components/auth-provider";
import { useCallback } from "react";

/**
 * A wrapper around fetch that automatically injects the Authorization header
 * with the current Supabase JWT. Use this for any client-side requests to your
 * backend that require authentication.
 *
 * @example
 * const authFetch = useAuthFetch();
 * const res = await authFetch("/api/predictions", { method: "POST", body: JSON.stringify(data) });
 */
export function useAuthFetch() {
  const { jwt } = useAuth();

  return useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const headers = new Headers(init?.headers);

      if (jwt) {
        headers.set("Authorization", `Bearer ${jwt}`);
      }

      return fetch(input, {
        ...init,
        headers,
      });
    },
    [jwt]
  );
}
