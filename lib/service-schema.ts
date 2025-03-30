import * as z from "zod"

export const serviceSchema = z.object({
  name: z.string().min(3, {
    message: "Service name must be at least 3 characters.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  images: z.array(z.instanceof(File)).optional(),
  userId: z.string().optional(), // Only required for admin users
})

export type ServiceFormValues = z.infer<typeof serviceSchema>

