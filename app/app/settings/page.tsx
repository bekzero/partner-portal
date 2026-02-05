import { redirect } from "next/navigation";
import { User, Mail, Shield, Key } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AccountSettingsForm } from "@/components/account-settings-form";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function SettingsPage() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Account Settings
        </h1>
        <p className="text-sm text-zinc-400">
          Manage your profile and security settings
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-1 ring-zinc-700">
              <AvatarFallback className="bg-zinc-800 text-lg text-zinc-300">
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-zinc-100">{user.name || "No name set"}</h3>
              <p className="text-sm text-zinc-500">{user.email}</p>
              <div className="mt-2">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={
                    user.role === "admin"
                      ? "bg-kzOrange text-zinc-950"
                      : "bg-zinc-800/60 text-zinc-400"
                  }
                >
                  <Shield className="mr-1 h-3 w-3" />
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-kzOrange" />
            <CardTitle className="text-zinc-100">Profile Information</CardTitle>
          </div>
          <CardDescription className="text-zinc-500">
            Update your display name and public profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountSettingsForm
            initialData={{
              name: user.name || "",
              email: user.email,
            }}
          />
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-kzOrange" />
            <CardTitle className="text-zinc-100">Security</CardTitle>
          </div>
          <CardDescription className="text-zinc-500">
            Change your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
