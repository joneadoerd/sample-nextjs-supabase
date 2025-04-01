import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Calendar } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Subscriptions</div>
            <p className="text-xs text-muted-foreground mt-1">
              Add, edit, or remove user subscriptions
            </p>
            <Button asChild className="w-full mt-4">
              <Link href="/admin/subscriptions">View Subscriptions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Users</div>
            <p className="text-xs text-muted-foreground mt-1">
              View and manage user accounts
            </p>
            <Button asChild className="w-full mt-4">
              <Link href="/admin/users">View Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              New Subscription
            </CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Add Subscription</div>
            <p className="text-xs text-muted-foreground mt-1">
              Create a new subscription for a user
            </p>
            <Button asChild className="w-full mt-4">
              <Link href="/admin/subscriptions/new">Add New Subscription</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
