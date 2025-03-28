import { z } from 'zod';

export const SubscriptionStatusSchema = z.enum(['ACTIVE','CANCELED','EXPIRED']);

export type SubscriptionStatusType = `${z.infer<typeof SubscriptionStatusSchema>}`

export default SubscriptionStatusSchema;
