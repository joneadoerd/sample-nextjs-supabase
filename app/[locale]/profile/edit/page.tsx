import type { Metadata } from "next"
import { EditProfileForm } from "@/components/edit-profile-form"

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Update your profile information",
}

export default function EditProfilePage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Edit Profile</h1>
        <EditProfileForm />
      </div>
    </div>
  )
}

