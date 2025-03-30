export const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: null,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: null,
    createdAt: new Date("2023-03-22"),
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex@example.com",
    image: null,
    createdAt: new Date("2023-05-10"),
  },
]

export const mockServices = [
  {
    id: "1",
    name: "Website Development",
    date: new Date("2023-06-15"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Website+Development+1",
      "/placeholder.svg?height=400&width=800&text=Website+Development+2",
      "/placeholder.svg?height=400&width=800&text=Website+Development+3",
    ],
    description:
      "Professional website development services. I can create responsive, modern websites for your business or personal needs. Using the latest technologies like React, Next.js, and Tailwind CSS.",
    price: 1200,
    userId: "1",
    user: mockUsers[0],
  },
  {
    id: "2",
    name: "Logo Design",
    date: new Date("2023-07-22"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Logo+Design+1",
      "/placeholder.svg?height=400&width=800&text=Logo+Design+2",
    ],
    description:
      "Creative logo design services. I'll create a unique and memorable logo that represents your brand identity. Includes multiple revisions and different file formats.",
    price: 300,
    userId: "2",
    user: mockUsers[1],
  },
  {
    id: "3",
    name: "Social Media Management",
    date: new Date("2023-08-10"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Social+Media+1",
      "/placeholder.svg?height=400&width=800&text=Social+Media+2",
      "/placeholder.svg?height=400&width=800&text=Social+Media+3",
    ],
    description:
      "Complete social media management for your business. I'll handle content creation, posting schedule, and engagement with your audience across multiple platforms.",
    price: 500,
    userId: "3",
    user: mockUsers[2],
  },
  {
    id: "4",
    name: "Mobile App Development",
    date: new Date("2023-09-05"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Mobile+App+1",
      "/placeholder.svg?height=400&width=800&text=Mobile+App+2",
    ],
    description:
      "Custom mobile app development for iOS and Android. I'll build a high-quality, user-friendly app that meets your specific requirements and business goals.",
    price: 2500,
    userId: "1",
    user: mockUsers[0],
  },
  {
    id: "5",
    name: "Content Writing",
    date: new Date("2023-09-18"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Content+Writing+1",
      "/placeholder.svg?height=400&width=800&text=Content+Writing+2",
      "/placeholder.svg?height=400&width=800&text=Content+Writing+3",
    ],
    description:
      "Professional content writing services for blogs, websites, and social media. I'll create engaging, SEO-optimized content that resonates with your target audience.",
    price: 150,
    userId: "2",
    user: mockUsers[1],
  },
  {
    id: "6",
    name: "Video Editing",
    date: new Date("2023-10-01"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Video+Editing+1",
      "/placeholder.svg?height=400&width=800&text=Video+Editing+2",
    ],
    description:
      "Professional video editing services for YouTube, social media, or business presentations. I'll transform your raw footage into polished, engaging videos.",
    price: 350,
    userId: "3",
    user: mockUsers[2],
  },
]

