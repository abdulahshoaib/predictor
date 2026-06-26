import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchUser } from "@/services/user";
import { UserProfile } from "@/types/user";

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchUser();

        setUser(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load user",
        );
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return {
    user,
    loading,
    error,
    setUser,
  };
}
