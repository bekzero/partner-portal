"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-zinc-300">
          Current Password
        </Label>
        <Input
          id="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
          required
          className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-zinc-300">
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
          required
          className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-zinc-300">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
          className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing...
            </>
          ) : success ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Changed
            </>
          ) : (
            "Change Password"
          )}
        </Button>
        {success && (
          <span className="text-sm text-green-400">
            Password changed successfully
          </span>
        )}
      </div>
    </form>
  );
}
