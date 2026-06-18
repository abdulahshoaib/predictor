"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  /** The current Supabase JWT access token, or null if not yet loaded */
  jwt: string | null;
  /** The user's ID (uuid) */
  userId: string | null;
  /** The user's display name (username or email) */
  username: string | null;
  /** The user's accumulated prediction points */
  points: number | null;
  /** The user's leaderboard visibility status ('enabled' or 'disabled') */
  leaderboard: 'enabled' | 'disabled' | null;
  /** Whether the auth state is still loading */
  loading: boolean;
  /** Force-refresh the session (e.g. after a token might have expired) */
  refreshSession: () => Promise<void>;
  /** Update the user's leaderboard visibility option */
  updateLeaderboardOpt: (status: 'enabled' | 'disabled') => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  jwt: null,
  userId: null,
  username: null,
  points: null,
  leaderboard: null,
  loading: true,
  refreshSession: async () => {},
  updateLeaderboardOpt: async () => {},
});

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [jwt, setJwt] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<'enabled' | 'disabled' | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const loadSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setJwt(session.access_token);
        setUserId(session.user.id);
        setUsername(
          (session.user.user_metadata?.username as string) ||
            session.user.email ||
            null
        );

        // Fetch user's points and leaderboard visibility from public.users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("points, leaderboard")
          .eq("id", session.user.id)
          .single();

        if (!userError && userData) {
          setPoints(userData.points);
          setLeaderboard(userData.leaderboard || 'enabled');
        } else {
          setPoints(0);
          setLeaderboard('enabled');
        }
      } else {
        setJwt(null);
        setUserId(null);
        setUsername(null);
        setPoints(null);
        setLeaderboard(null);
      }
    } catch (err) {
      console.error("Failed to load session:", err);
      setJwt(null);
      setUserId(null);
      setUsername(null);
      setPoints(null);
      setLeaderboard(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updateLeaderboardOpt = useCallback(async (status: 'enabled' | 'disabled') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("users")
        .update({ leaderboard: status })
        .eq("id", session.user.id);

      if (!error) {
        setLeaderboard(status);
      } else {
        console.error("Failed to update leaderboard status:", error.message);
      }
    } catch (err) {
      console.error("Error updating leaderboard status:", err);
    }
  }, [supabase]);

  useEffect(() => {
    loadSession();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setJwt(session.access_token);
        setUserId(session.user.id);
        setUsername(
          (session.user.user_metadata?.username as string) ||
            session.user.email ||
            null
        );

        try {
          const { data: userData } = await supabase
            .from("users")
            .select("points, leaderboard")
            .eq("id", session.user.id)
            .single();
          if (userData) {
            setPoints(userData.points);
            setLeaderboard(userData.leaderboard || 'enabled');
          } else {
            setPoints(0);
            setLeaderboard('enabled');
          }
        } catch {
          setPoints(0);
          setLeaderboard('enabled');
        }
      } else {
        setJwt(null);
        setUserId(null);
        setUsername(null);
        setPoints(null);
        setLeaderboard(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadSession, supabase]);

  return (
    <AuthContext.Provider
      value={{ jwt, userId, username, points, leaderboard, loading, refreshSession: loadSession, updateLeaderboardOpt }}
    >
      {children}
    </AuthContext.Provider>
  );
}
