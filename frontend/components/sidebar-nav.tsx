"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  FolderTree,
  Warehouse,
  Wrench,
  Trash2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { getCurrentUser, logout, type UserRecord } from "@/lib/auth";
import { useEffect, useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Assets",
    href: "/assets",
    icon: Package,
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Building2,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Classifications",
    href: "/classifications",
    icon: FolderTree,
  },
  {
    title: "Storage",
    href: "/storage",
    icon: Warehouse,
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Disposal",
    href: "/disposal",
    icon: Trash2,
  },
  {
    title: "Login",
    href: "/login",
    icon: LogIn,
  },
  {
    title: "Register",
    href: "/register",
    icon: UserPlus,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setReady(true);
  }, []);

  if (!ready) return <div className="flex h-screen w-64" />;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-bold text-foreground">Asset Manager</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {(user
          ? navItems
          : navItems.filter((i) =>
              ["/login", "/register", "/"].includes(i.href)
            )
        ).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
        {user && (
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className={cn(
              "mt-4 w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  );
}
