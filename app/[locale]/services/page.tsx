import type { Metadata } from "next";
import { isAdmin } from "@/actions/checkAdmin";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { ServiceList } from "./ServiceList";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Services",
  description: "Browse all available services",
};

export default async function ServicesPage() {
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
      <Suspense fallback={<Loading />}>
        <ServiceList />
      </Suspense>
    </div>
  );
}
