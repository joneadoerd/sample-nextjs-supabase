import { getUsers } from "@/lib/subscription-actions";
import { SubscriptionForm } from "@/components/subscription-form";

export const metadata = {
  title: "Add Subscription | Admin Dashboard",
};

export default async function NewSubscriptionPage() {
  const { users, error } = await getUsers();

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Subscription</h1>
      <SubscriptionForm users={users || []} />
    </div>
  );
}
