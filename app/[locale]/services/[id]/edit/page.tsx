import { notFound } from "next/navigation";
import { getServiceByUserId } from "@/lib/service-actions";
import { Profile, ServiceWithRelations } from "@/prisma/types";
import ServiceForm from "@/components/services/service-form";

interface EditServicePageProps {
  id: string;
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<EditServicePageProps>;
}) {
  const { id } = await params;
  const { service, error } = await getServiceByUserId(id);

  if (error || !service) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Edit Service</h1>
        <ServiceForm
          service={service as ServiceWithRelations}
          user={service.user as Profile}
        />
        {/* <EditServiceForm service={service as ServiceWithRelations} /> */}
      </div>
    </div>
  );
}
