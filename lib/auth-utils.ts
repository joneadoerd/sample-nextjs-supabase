const mockCurrentUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "user", // Change to "admin" to test admin functionality
  image: "/placeholder.svg?height=40&width=40",
}

export function getCurrentUser() {
  // In a real app, you would get the current user from your auth system
  return mockCurrentUser
}

export function isAdmin() {
  const user = getCurrentUser()
  return user?.role === "admin"
}

