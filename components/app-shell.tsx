"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Building2,
  FolderOpen,
  Megaphone,
  Settings,
  Users,
  Shield,
  ShieldCheck,
  Menu,
  Search,
  ChevronDown,
  LogOut,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlobalSearch } from "@/components/global-search";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  };
}

const mainNavItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Battle Cards", href: "/battle-cards", icon: FileText },
  { name: "Industries", href: "/industries", icon: Building2 },
  { name: "Resources", href: "/resources", icon: FolderOpen },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  { name: "Security Assessment", href: "/security-assessment", icon: ShieldCheck },
];

const adminNavItems = [
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Manage Content", href: "/admin/content", icon: Shield },
];

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user.role === "admin";

  const NavLink = ({
    item,
    onClick,
  }: {
    item: (typeof mainNavItems)[0];
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kzOrange focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
          isActive
            ? "bg-kzOrange text-black font-semibold"
            : "text-white hover:bg-zinc-700 hover:text-kzOrange"
        }`}
      >
        <Icon className="h-4 w-4" />
        {item.name}
      </Link>
    );
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-4">
        <Image
          src="/dark-favicon.png"
          alt="KZero"
          width={32}
          height={32}
          className="h-8 w-auto"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-wide text-white">KZero Passwordless Partner Portal</span>
          <span className="text-xs text-zinc-400">Enablement Hub</span>
        </div>
      </div>

      <Separator className="bg-zinc-800/60" />

      <div className="flex-1 overflow-auto px-3 py-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} onClick={onItemClick} />
          ))}
        </nav>

        {isAdmin && (
          <>
            <Separator className="my-4 bg-zinc-800/60" />
            <div className="px-3 mb-2">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Admin
              </span>
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <NavLink key={item.href} item={item} onClick={onItemClick} />
              ))}
            </nav>
          </>
        )}
      </div>

      <Separator className="bg-zinc-800/60" />

      <div className="p-3">
        <Link
          href="/settings"
          onClick={onItemClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kzOrange focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
            pathname === "/settings"
              ? "bg-kzOrange text-black font-semibold"
              : "text-white hover:bg-zinc-700 hover:text-kzOrange"
          }`}
        >
          <Settings className="h-4 w-4" />
          Account Settings
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-zinc-800/60 bg-zinc-950 lg:flex">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-zinc-800/60 bg-zinc-950 p-0">
                <SidebarContent onItemClick={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Search */}
            <GlobalSearch />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-kzOrange"
              >
                <Avatar className="h-8 w-8 ring-1 ring-zinc-700">
                  <AvatarFallback className="bg-zinc-800 text-xs text-zinc-300">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                  <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-zinc-800/60 bg-zinc-950"
            >
              <DropdownMenuLabel className="text-zinc-300">
                <div className="flex flex-col">
                  <span>{user.name || user.email}</span>
                  <span className="text-xs text-zinc-500">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800/60" />
              <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800/50 focus:text-zinc-100">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800/60" />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="text-red-400 focus:bg-red-950/30 focus:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-zinc-950 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
