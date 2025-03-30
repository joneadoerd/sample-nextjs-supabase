import * as z from "zod"

export const subscriptionSchema = z.object({
  userId: z.string({
    required_error: "User is required",
  }),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  expire_date: z
    .date({
      required_error: "Expiration date is required",
    })
    .refine((date) => date > new Date(), {
      message: "Expiration date must be in the future",
    }),
  status_subscription: z.enum(["ACTIVE", "CANCELED", "EXPIRED"], {
    required_error: "Status is required",
  }),
})

export const subscriptionUpdateSchema = subscriptionSchema.extend({
  id: z.string(),
})

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>
export type SubscriptionUpdateFormValues = z.infer<typeof subscriptionUpdateSchema>

