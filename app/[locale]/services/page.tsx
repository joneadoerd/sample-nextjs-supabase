import type { Metadata } from "next"
import Link from "next/link"
import { ServiceCard } from "@/components/services/service-card"
import { mockServices } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Services",
  description: "Browse all available services",
}

export default function ServicesPage() {
  const services = mockServices

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Services</h1>
    
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">No services found</h2>
          <p className="text-muted-foreground mb-6">Be the first to add a service!</p>
         
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}

