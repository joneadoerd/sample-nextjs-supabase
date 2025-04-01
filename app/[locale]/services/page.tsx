import type { Metadata } from "next";
import { ServiceCard } from "@/components/services/service-card";
import { getServices } from "@/lib/service-actions";
import { ServiceWithRelations } from "@/prisma/types";
import { isAdmin } from "@/actions/checkAdmin";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description: "Browse all available services",
};

export default async function ServicesPage() {
  const { services } = await getServices();
  const isUserAdmin = await isAdmin();
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Services</h1>
        {isUserAdmin && (
          <Button asChild>
            <Link href={`/services/new`}>Add Service</Link>
          </Button>
        )}
      </div>
      {services?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">No services found</h2>
          <p className="text-muted-foreground mb-6">
            Be the first to add a service!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <ServiceCard
              key={service.id}
              service={service as ServiceWithRelations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
