import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SubscriptionNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-2xl font-bold mb-2">Subscription Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The subscription you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/admin/subscriptions">Back to Subscriptions</Link>
      </Button>
    </div>
  );
}
