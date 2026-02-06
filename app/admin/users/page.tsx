import { redirect } from "next/navigation";
import { Users, Shield, Mail, Calendar } from "lucide-react";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "date-fns";

export default async function AdminUsersPage() {
  const session = await getSession();
  
  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Manage Users
          </h1>
          <p className="text-sm text-zinc-400">
            View and manage portal users
          </p>
        </div>
        <Button className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90">
          Invite User
        </Button>
      </div>

      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-kzOrange" />
            <CardTitle className="text-zinc-100">All Users</CardTitle>
          </div>
          <CardDescription className="text-zinc-500">
            {users.length} total user{users.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 ring-1 ring-zinc-700">
                    <AvatarFallback className="bg-zinc-800 text-zinc-300">
                      {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-200">
                        {user.name || "No name"}
                      </span>
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
                    <div className="flex items-center gap-3 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Joined {formatDate(user.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
