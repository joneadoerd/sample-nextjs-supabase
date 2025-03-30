import { notFound } from "next/navigation";
import { getSubscription, getUsers } from "@/lib/subscription-actions";
import { SubscriptionForm } from "@/components/subscription-form";

interface EditSubscriptionPageProps {
  id: string;
}

export default async function EditSubscriptionPage({
  params,
}: {
  params: Promise<EditSubscriptionPageProps>;
}) {
  const { id } = await params;
  const { subscription, error: subscriptionError } = await getSubscription(id);
  const { users, error: usersError } = await getUsers();

  if (subscriptionError || !subscription) {
    notFound();
  }

  if (usersError) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md">
        {usersError}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Subscription</h1>
      <SubscriptionForm
        users={users || []}
        initialData={{
          id: subscription.id,
          userId: subscription.userId,
          start_date: new Date(subscription.start_date),
          expire_date: new Date(subscription.expire_date),
          status_subscription: subscription.status_subscription,
        }}
      />
    </div>
  );
}
