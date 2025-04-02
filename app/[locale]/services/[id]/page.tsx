import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ServiceImageGallery } from "@/components/services/service-image-gallery";
import { getServiceById } from "@/lib/service-actions";
import { getCurrentUserProfile } from "@/actions/user-actions";

interface ServicePageProps {
  id: string;
}

export default async function ServicePage({
  params,
}: {
  params: Promise<ServicePageProps>;
}) {
  const { id } = await params;
  const { service } = await getServiceById(id);
  const currentUser = await getCurrentUserProfile();
  const canEdit =
    currentUser?.role === "admin" ||
    (service && service.userId === currentUser?.id);
  if (!service) {
    redirect(`/services/${currentUser?.id}/add`);
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{service.name}</h1>
            {canEdit && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/services/${service?.userId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Service
                </Link>
              </Button>
            )}
          </div>

          <ServiceImageGallery
            images={service?.images?.map((image) => image.url || "") || []}
          />

          <div className="mt-8">
            <div className="flex items-center gap-2 mt-2">
              {/* <p className="text-2xl font-semibold text-primary">
                ${service.price.toFixed(2)}
              </p> */}
              <p className="text-sm text-muted-foreground">
                • Posted {format(new Date(service.date), "MMM d, yyyy")}
              </p>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            <Separator className="my-6" />

            {/* <ServiceComments serviceId={service.id} /> */}
          </div>
        </div>

        <div>
          <div className="sticky top-6">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage alt={service?.user?.name} />
                  <AvatarFallback>
                    {service?.user?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{service?.user?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Service Provider
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {service?.user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      service?.user?.createdAt || new Date(),
                      "MMM d, yyyy",
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                  Contact Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
