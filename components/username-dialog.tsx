"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateUser } from "@/services/user";
import { UserProfile } from "@/types/user";
import { User, Camera } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

interface UsernameDialogProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsernameDialog({
  user,
  onUpdate,
  open,
  onOpenChange,
}: UsernameDialogProps) {
  const [value, setValue] = useState(user.user_name);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === user.user_name) {
      onOpenChange(false);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUser({ user_name: trimmed });
      onUpdate(updated);
      toast.success("Username updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const avatar_url = `${urlData.publicUrl}?t=${Date.now()}`;
      const updated = await updateUser({ avatar_url });
      onUpdate(updated);
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar size="lg" className="size-20">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.user_name} />
              ) : (
                <AvatarFallback>
                  <User className="size-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Camera className="size-3.5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {uploading && (
            <span className="text-xs text-muted-foreground">Uploading...</span>
          )}

          <div className="w-full space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Username
            </label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="Enter new username"
              autoFocus
              maxLength={24}
            />
          </div>

          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !value.trim()}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
