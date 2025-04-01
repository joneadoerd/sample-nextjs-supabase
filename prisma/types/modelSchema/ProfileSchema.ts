import { z } from 'zod';
import { RoleSchema } from '../inputTypeSchemas/RoleSchema'
import { SubscriptionWithRelationsSchema, SubscriptionPartialWithRelationsSchema, SubscriptionOptionalDefaultsWithRelationsSchema } from './SubscriptionSchema'
import type { SubscriptionWithRelations, SubscriptionPartialWithRelations, SubscriptionOptionalDefaultsWithRelations } from './SubscriptionSchema'
import { ServiceWithRelationsSchema, ServicePartialWithRelationsSchema, ServiceOptionalDefaultsWithRelationsSchema } from './ServiceSchema'
import type { ServiceWithRelations, ServicePartialWithRelations, ServiceOptionalDefaultsWithRelations } from './ServiceSchema'

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
  role: RoleSchema,
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.coerce.date(),
})

export type Profile = z.infer<typeof ProfileSchema>

/////////////////////////////////////////
// PROFILE PARTIAL SCHEMA
/////////////////////////////////////////

export const ProfilePartialSchema = ProfileSchema.partial()

export type ProfilePartial = z.infer<typeof ProfilePartialSchema>

/////////////////////////////////////////
// PROFILE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ProfileOptionalDefaultsSchema = ProfileSchema.merge(z.object({
  role: RoleSchema.optional(),
  name: z.string().optional(),
  createdAt: z.coerce.date().optional(),
}))

export type ProfileOptionalDefaults = z.infer<typeof ProfileOptionalDefaultsSchema>

/////////////////////////////////////////
// PROFILE RELATION SCHEMA
/////////////////////////////////////////

export type ProfileRelations = {
  subscriptions?: SubscriptionWithRelations | null;
  services?: ServiceWithRelations | null;
};

export type ProfileWithRelations = z.infer<typeof ProfileSchema> & ProfileRelations

export const ProfileWithRelationsSchema: z.ZodType<ProfileWithRelations> = ProfileSchema.merge(z.object({
  subscriptions: z.lazy(() => SubscriptionWithRelationsSchema).nullable(),
  services: z.lazy(() => ServiceWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// PROFILE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ProfileOptionalDefaultsRelations = {
  subscriptions?: SubscriptionOptionalDefaultsWithRelations | null;
  services?: ServiceOptionalDefaultsWithRelations | null;
};

export type ProfileOptionalDefaultsWithRelations = z.infer<typeof ProfileOptionalDefaultsSchema> & ProfileOptionalDefaultsRelations

export const ProfileOptionalDefaultsWithRelationsSchema: z.ZodType<ProfileOptionalDefaultsWithRelations> = ProfileOptionalDefaultsSchema.merge(z.object({
  subscriptions: z.lazy(() => SubscriptionOptionalDefaultsWithRelationsSchema).nullable(),
  services: z.lazy(() => ServiceOptionalDefaultsWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// PROFILE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ProfilePartialRelations = {
  subscriptions?: SubscriptionPartialWithRelations | null;
  services?: ServicePartialWithRelations | null;
};

export type ProfilePartialWithRelations = z.infer<typeof ProfilePartialSchema> & ProfilePartialRelations

export const ProfilePartialWithRelationsSchema: z.ZodType<ProfilePartialWithRelations> = ProfilePartialSchema.merge(z.object({
  subscriptions: z.lazy(() => SubscriptionPartialWithRelationsSchema).nullable(),
  services: z.lazy(() => ServicePartialWithRelationsSchema).nullable(),
})).partial()

export type ProfileOptionalDefaultsWithPartialRelations = z.infer<typeof ProfileOptionalDefaultsSchema> & ProfilePartialRelations

export const ProfileOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ProfileOptionalDefaultsWithPartialRelations> = ProfileOptionalDefaultsSchema.merge(z.object({
  subscriptions: z.lazy(() => SubscriptionPartialWithRelationsSchema).nullable(),
  services: z.lazy(() => ServicePartialWithRelationsSchema).nullable(),
}).partial())

export type ProfileWithPartialRelations = z.infer<typeof ProfileSchema> & ProfilePartialRelations

export const ProfileWithPartialRelationsSchema: z.ZodType<ProfileWithPartialRelations> = ProfileSchema.merge(z.object({
  subscriptions: z.lazy(() => SubscriptionPartialWithRelationsSchema).nullable(),
  services: z.lazy(() => ServicePartialWithRelationsSchema).nullable(),
}).partial())

export default ProfileSchema;
