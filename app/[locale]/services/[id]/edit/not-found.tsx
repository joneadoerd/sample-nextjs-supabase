import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The service you're trying to edit doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/services">Back to Services</Link>
      </Button>
    </div>
  );
}
