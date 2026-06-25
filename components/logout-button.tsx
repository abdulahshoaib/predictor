"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SignOut } from "@phosphor-icons/react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button onClick={logout} size="sm">
      <SignOut className="size-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
}
