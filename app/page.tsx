"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Building2, Wrench } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser, type UserRecord } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u);
    setReady(true);
    if (!u) {
      // if not authenticated, send visitor to registration page
      router.push('/register')
    }
  }, []);

  if (!ready) {
    return <div className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <div className="mx-auto my-24 w-full max-w-md p-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Welcome to Asset Manager
          </h1>
          <p className="mb-6 text-muted-foreground">
            Create an account or sign in to continue.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  const stats = [
    {
      title: "Total Assets",
      value: "0",
      icon: Package,
      description: "No data yet",
    },
    {
      title: "Active Users",
      value: "0",
      icon: Users,
      description: "No data yet",
    },
    {
      title: "Suppliers",
      value: "0",
      icon: Building2,
      description: "No data yet",
    },
    {
      title: "Maintenance Due",
      value: "0",
      icon: Wrench,
      description: "No data yet",
    },
  ];

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your asset management system
          </p>
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
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
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
              <div className="space-y-4">{[] as any[]}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">{[] as any[]}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
