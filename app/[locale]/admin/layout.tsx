import type { ReactNode } from "react";
import Link from "next/link";
import { Home, Users, Calendar } from "lucide-react";
import { getCurrentUserProfile } from "@/actions/user-actions";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

// This is a mock auth check - in a real app, you'd use your auth system

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  let user = null;
  try {
    user = await getCurrentUserProfile();
  } catch (error) {
    user = null;
  }

  // If not an admin, redirect to home
  if (!user || user.role !== "admin") {
    return redirect({
      href: "/",
      locale: await getLocale(),
    });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/subscriptions"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              >
                <Calendar size={18} />
                <span>Subscriptions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              >
                <Users size={18} />
                <span>Users</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
