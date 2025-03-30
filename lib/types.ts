export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

export type Subscription = {
  id: string
  start_date: Date
  expire_date: Date
  status_subscription: "ACTIVE" | "CANCELED" | "EXPIRED"
  userId: string
  user: User
}

export type Service = {
  id: string
  name: string
  date: Date
  images: string[]
  description: string
  userId: string
  user: User
}

export type ServiceWithUser = Service & {
  user: User
}

export const subscriptionStatusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Canceled", value: "CANCELED" },
  { label: "Expired", value: "EXPIRED" },
]

