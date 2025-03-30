import type { Metadata } from "next"
import AddServiceForm from "@/components/services/add-service-form"
import { isAdmin } from "@/actions/checkAdmin"
import { getCurrentUserProfile } from "@/actions/user-actions"
import { Profile } from "@/prisma/types"

export const metadata: Metadata = {
  title: "Add Service",
  description: "Add a new service to the platform",
}
export default async function AddServicePage() { 
  const user = await getCurrentUserProfile() 
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Add New Service</h1>
        <AddServiceForm currentUser={user as Profile} />
      </div>
    </div>
  )
}

