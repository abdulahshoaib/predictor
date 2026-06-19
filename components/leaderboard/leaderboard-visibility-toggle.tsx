"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "../ui/button";

export function LeaderboardVisibilityToggle() {
  const { leaderboard, updateLeaderboardOpt } = useAuth();
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  if (!leaderboard) return null;

  const isEnabled = leaderboard === "enabled";

  const handleClick = () => {
    // Opting in doesn't need confirmation, opting out does
    if (isEnabled) {
      setConfirming(true);
    } else {
      handleSave("enabled");
    }
  };

  const handleSave = async (newStatus: "enabled" | "disabled") => {
    setSaving(true);
    setConfirming(false);
    await updateLeaderboardOpt(newStatus);
    router.refresh();
    setSaving(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Inline confirm step when opting out */}
      {confirming ? (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Hide your profile?</span>
          <Button onClick={() => handleSave("disabled")} disabled={saving}>
            Yes, hide me
          </Button>
          <Button onClick={() => setConfirming(false)} variant="outline">
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={handleClick} disabled={saving} variant="outline">
          {saving ? (
            <>
              <span className="h-2.5 w-2.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Saving…
            </>
          ) : isEnabled ? (
            "Hide"
          ) : (
            "Join the fun"
          )}
        </Button>
      )}
    </div>
  );
}
