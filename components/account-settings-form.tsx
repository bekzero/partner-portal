"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountSettingsFormProps {
  initialData: {
    name: string;
    email: string;
  };
}

export function AccountSettingsForm({ initialData }: AccountSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-zinc-300">
          Display Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your name"
          className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-300">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          disabled
          className="border-zinc-800/60 bg-zinc-950/30 text-zinc-500 cursor-not-allowed"
        />
        <p className="text-xs text-zinc-600">
          Email cannot be changed. Contact an administrator for assistance.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : success ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        {success && (
          <span className="text-sm text-green-400">
            Profile updated successfully
          </span>
        )}
      </div>
    </form>
  );
}
