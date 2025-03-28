import { z } from 'zod';
import { SubscriptionStatusSchema } from '../inputTypeSchemas/SubscriptionStatusSchema'
import { ProfileWithRelationsSchema, ProfilePartialWithRelationsSchema, ProfileOptionalDefaultsWithRelationsSchema } from './ProfileSchema'
import type { ProfileWithRelations, ProfilePartialWithRelations, ProfileOptionalDefaultsWithRelations } from './ProfileSchema'

/////////////////////////////////////////
// SUBSCRIPTION SCHEMA
/////////////////////////////////////////

export const SubscriptionSchema = z.object({
  status_subscription: SubscriptionStatusSchema,
  id: z.string(),
  start_date: z.coerce.date(),
  expire_date: z.coerce.date(),
  userId: z.string(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

/////////////////////////////////////////
// SUBSCRIPTION PARTIAL SCHEMA
/////////////////////////////////////////

export const SubscriptionPartialSchema = SubscriptionSchema.partial()

export type SubscriptionPartial = z.infer<typeof SubscriptionPartialSchema>

/////////////////////////////////////////
// SUBSCRIPTION OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const SubscriptionOptionalDefaultsSchema = SubscriptionSchema.merge(z.object({
  status_subscription: SubscriptionStatusSchema.optional(),
  id: z.string().optional(),
}))

export type SubscriptionOptionalDefaults = z.infer<typeof SubscriptionOptionalDefaultsSchema>

/////////////////////////////////////////
// SUBSCRIPTION RELATION SCHEMA
/////////////////////////////////////////

export type SubscriptionRelations = {
  user: ProfileWithRelations;
};

export type SubscriptionWithRelations = z.infer<typeof SubscriptionSchema> & SubscriptionRelations

export const SubscriptionWithRelationsSchema: z.ZodType<SubscriptionWithRelations> = SubscriptionSchema.merge(z.object({
  user: z.lazy(() => ProfileWithRelationsSchema),
}))

/////////////////////////////////////////
// SUBSCRIPTION OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type SubscriptionOptionalDefaultsRelations = {
  user: ProfileOptionalDefaultsWithRelations;
};

export type SubscriptionOptionalDefaultsWithRelations = z.infer<typeof SubscriptionOptionalDefaultsSchema> & SubscriptionOptionalDefaultsRelations

export const SubscriptionOptionalDefaultsWithRelationsSchema: z.ZodType<SubscriptionOptionalDefaultsWithRelations> = SubscriptionOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => ProfileOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// SUBSCRIPTION PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type SubscriptionPartialRelations = {
  user?: ProfilePartialWithRelations;
};

export type SubscriptionPartialWithRelations = z.infer<typeof SubscriptionPartialSchema> & SubscriptionPartialRelations

export const SubscriptionPartialWithRelationsSchema: z.ZodType<SubscriptionPartialWithRelations> = SubscriptionPartialSchema.merge(z.object({
  user: z.lazy(() => ProfilePartialWithRelationsSchema),
})).partial()

export type SubscriptionOptionalDefaultsWithPartialRelations = z.infer<typeof SubscriptionOptionalDefaultsSchema> & SubscriptionPartialRelations

export const SubscriptionOptionalDefaultsWithPartialRelationsSchema: z.ZodType<SubscriptionOptionalDefaultsWithPartialRelations> = SubscriptionOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => ProfilePartialWithRelationsSchema),
}).partial())

export type SubscriptionWithPartialRelations = z.infer<typeof SubscriptionSchema> & SubscriptionPartialRelations

export const SubscriptionWithPartialRelationsSchema: z.ZodType<SubscriptionWithPartialRelations> = SubscriptionSchema.merge(z.object({
  user: z.lazy(() => ProfilePartialWithRelationsSchema),
}).partial())

export default SubscriptionSchema;
