import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/service-actions";
import EditServiceForm from "@/components/services/edit-service-form";
import { ServiceWithRelations } from "@/prisma/types";

interface EditServicePageProps {
  id: string;
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<EditServicePageProps>;
}) {
  const { service, error } = await getServiceById((await params).id);

  if (error || !service) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Edit Service</h1>
        <EditServiceForm service={service as ServiceWithRelations} />
      </div>
    </div>
  );
}
