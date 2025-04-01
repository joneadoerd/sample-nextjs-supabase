import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionsTable } from "@/components/subscriptions-table";
import { getSubscriptions } from "@/lib/subscription-actions";

export const metadata = {
  title: "Subscriptions | Admin Dashboard",
};

export default async function SubscriptionsPage() {
  const { subscriptions, error } = await getSubscriptions();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <Button asChild>
          <Link href="/admin/subscriptions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Subscription
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : (
        <SubscriptionsTable subscriptions={subscriptions || []} />
      )}
    </div>
  );
}
