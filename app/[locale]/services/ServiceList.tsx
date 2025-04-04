"use server";
import { ServiceCard } from "@/components/services/service-card";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getAllActiveServices } from "@/lib/service-actions";
import { ServiceWithRelations } from "@/prisma/types";
import { unstable_cache } from "next/cache";

const getServices = unstable_cache(
  async () => {
    return await getAllActiveServices();
  },
  ["services"],
  { tags: ["services"], revalidate: 3600 }
);
export const ServiceList = async () => {
  const { services, error } = await getServices();

  return (
    <>
      {error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">No services found</h2>
          <Link
            href={`/services`}
            className={buttonVariants({ variant: "outline" })}
          >
            refresh
          </Link>
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
    </>
  );
};
