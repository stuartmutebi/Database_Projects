"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Building2, Wrench } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser, type UserRecord } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function DashboardPage() {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState([
    { title: "Total Assets", value: "-", icon: Package, description: "" },
    { title: "Active Users", value: "-", icon: Users, description: "" },
    { title: "Suppliers", value: "-", icon: Building2, description: "" },
    { title: "Open Maintenance", value: "-", icon: Wrench, description: "" },
  ]);
  const [recentAssets, setRecentAssets] = useState<any[]>([]);
  const [upcomingMaint, setUpcomingMaint] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [a, u, s, m] = await Promise.all([
          fetch(`${API_BASE_URL}/api/assets`),
          fetch(`${API_BASE_URL}/api/users`),
          fetch(`${API_BASE_URL}/api/suppliers`),
          fetch(`${API_BASE_URL}/api/maintenance`),
        ]);
        const [assets, users, suppliers, maintenance] = await Promise.all([
          a.json(),
          u.json(),
          s.json(),
          m.json(),
        ]);
        const activeUsers = (users || []).filter((x: any) => x.status === "Active").length;
        const openMaint = (maintenance || []).length;
        setStats([
          { title: "Total Assets", value: String((assets || []).length), icon: Package, description: "All registered assets" },
          { title: "Active Users", value: String(activeUsers), icon: Users, description: "Users available for assignment" },
          { title: "Suppliers", value: String((suppliers || []).length), icon: Building2, description: "Vendors you buy from" },
          { title: "Open Maintenance", value: String(openMaint), icon: Wrench, description: "Service tickets recorded" },
        ]);
        setRecentAssets((assets || []).slice(-5).reverse());
        const upcoming = (maintenance || []).slice(-5).reverse();
        setUpcomingMaint(upcoming);
      } catch (e) {
        // best effort on dashboard
      }
    })();
  }, [user]);

  if (!ready) {
    return <div className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center p-6 route-container">
        <div className="landing-card grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl bg-card">
          {/* Left panel */}
          <div className="landing-left p-10 text-white flex items-center justify-center">
            <div className="welcome-blob max-w-sm text-center md:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">Hello, Welcome!</h2>
              <p className="opacity-90 mb-6">Don't have an account?</p>
              <Button asChild className="bg-white text-foreground hover:bg-white/90">
                <Link href="/register" prefetch>
                  Register
                </Link>
              </Button>
            </div>
          </div>
          {/* Right panel */}
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Use the Login button below to go to the sign in form.</p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button asChild className="px-6">
                <Link href="/login" prefetch>
                  Login
                </Link>
              </Button>
              <Button variant="outline" asChild className="px-6">
                <Link href="/register" prefetch>
                  Register
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your asset management system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentAssets.length === 0 && (
                  <div className="text-sm text-muted-foreground">No assets yet.</div>
                )}
                {recentAssets.map((a: any) => (
                  <div key={a.asset_id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{a.asset_name}</span>
                    <span className="text-muted-foreground">{a.serial_number || "-"}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingMaint.length === 0 && (
                  <div className="text-sm text-muted-foreground">No maintenance records.</div>
                )}
                {upcomingMaint.map((m: any) => (
                  <div key={m.maintenance_id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">Asset #{m.asset_id}</span>
                    <span className="text-muted-foreground">
                      {m.maintenance_date ? String(m.maintenance_date).slice(0, 10) : "-"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
