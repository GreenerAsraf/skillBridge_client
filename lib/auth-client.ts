"use client";

import { useState, useEffect, useCallback } from "react";

// ── Backend base URL ────────────────────────────────────────────────────
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ?? "";

// ── Token helpers ───────────────────────────────────────────────────────
const TOKEN_KEY = "skillbridge_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Typed helpers ───────────────────────────────────────────────────────
type AuthResult<T> = { data: T | null; error: { message: string } | null };

async function authFetch<T>(
  path: string,
  body: Record<string, unknown>
): Promise<AuthResult<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return { data: null, error: { message: json.message || "Request failed" } };
    }

    return { data: json.data as T, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || "Network error" } };
  }
}

// ── Sign Up ─────────────────────────────────────────────────────────────
interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  [key: string]: unknown;
}




interface SignUpResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const signUp = {
  email: async (payload: SignUpPayload): Promise<AuthResult<{ user: SignUpResponse }>> => {
    const result = await authFetch<SignUpResponse>("/api/auth/register", payload);

    if (result.data) {
      // After registration, auto-login to get a token
      const loginResult = await authFetch<{ token: string; user: SignUpResponse }>(
        "/api/auth/login",
        { email: payload.email, password: payload.password }
      );

      if (loginResult.data) {
        setToken(loginResult.data.token);
        return { data: { user: loginResult.data.user }, error: null };
      }

      // Registration succeeded but auto-login failed — still success
      return { data: { user: result.data }, error: null };
    }

    return { data: null, error: result.error };
  },
};

// ── Sign In ─────────────────────────────────────────────────────────────
interface SignInPayload {
  email: string;
  password: string;
  [key: string]: unknown;
}

interface SignInResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
}

export const signIn = {
  email: async (payload: SignInPayload): Promise<AuthResult<{ user: SignInResponse["user"] }>> => {
    const result = await authFetch<SignInResponse>("/api/auth/login", payload);

    if (result.data) {
      setToken(result.data.token);
      return { data: { user: result.data.user }, error: null };
    }

    return { data: null, error: result.error };
  },
};

// ── Sign Out ────────────────────────────────────────────────────────────
export async function signOut() {
  removeToken();
}

// ── useSession hook (replaces better-auth's useSession) ─────────────────
interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  [key: string]: unknown;
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsPending(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) {
        removeToken();
        setUser(null);
      } else {
        const json = await res.json();
        setUser(json.data as SessionUser);
      }
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // Return shape compatible with existing auth-provider usage
  return {
    data: user ? { user } : null,
    isPending,
    refetch: fetchMe,
  };
}
