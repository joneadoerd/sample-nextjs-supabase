import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Edit } from "lucide-react"

export const metadata: Metadata = {
  title: "Profile",
  description: "View your profile information",
}

// Mock user data - in a real app, this would come from your auth system
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  bio: "Software developer with a passion for creating user-friendly applications.",
  image: "/placeholder.svg?height=200&width=200",
  memberSince: "January 15, 2023",
}

export default function ProfilePage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button asChild>
            <Link href="/profile/edit">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={mockUser.image} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
              <p className="text-muted-foreground">{mockUser.email}</p>
              <p className="text-sm text-muted-foreground mt-1">Member since {mockUser.memberSince}</p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Bio</h3>
            <p className="text-muted-foreground">{mockUser.bio}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

