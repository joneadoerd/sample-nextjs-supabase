import { z } from 'zod';
import { ProfileWithRelationsSchema, ProfilePartialWithRelationsSchema, ProfileOptionalDefaultsWithRelationsSchema } from './ProfileSchema'
import type { ProfileWithRelations, ProfilePartialWithRelations, ProfileOptionalDefaultsWithRelations } from './ProfileSchema'
import { ServiceImageWithRelationsSchema, ServiceImagePartialWithRelationsSchema, ServiceImageOptionalDefaultsWithRelationsSchema } from './ServiceImageSchema'
import type { ServiceImageWithRelations, ServiceImagePartialWithRelations, ServiceImageOptionalDefaultsWithRelations } from './ServiceImageSchema'

/////////////////////////////////////////
// SERVICE SCHEMA
/////////////////////////////////////////

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
})

export type Service = z.infer<typeof ServiceSchema>

/////////////////////////////////////////
// SERVICE PARTIAL SCHEMA
/////////////////////////////////////////

export const ServicePartialSchema = ServiceSchema.partial()

export type ServicePartial = z.infer<typeof ServicePartialSchema>

/////////////////////////////////////////
// SERVICE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ServiceOptionalDefaultsSchema = ServiceSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
}))

export type ServiceOptionalDefaults = z.infer<typeof ServiceOptionalDefaultsSchema>

/////////////////////////////////////////
// SERVICE RELATION SCHEMA
/////////////////////////////////////////

export type ServiceRelations = {
  user: ProfileWithRelations;
  images: ServiceImageWithRelations[];
};

export type ServiceWithRelations = z.infer<typeof ServiceSchema> & ServiceRelations

export const ServiceWithRelationsSchema: z.ZodType<ServiceWithRelations> = ServiceSchema.merge(z.object({
  user: z.lazy(() => ProfileWithRelationsSchema),
  images: z.lazy(() => ServiceImageWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SERVICE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ServiceOptionalDefaultsRelations = {
  user: ProfileOptionalDefaultsWithRelations;
  images: ServiceImageOptionalDefaultsWithRelations[];
};

export type ServiceOptionalDefaultsWithRelations = z.infer<typeof ServiceOptionalDefaultsSchema> & ServiceOptionalDefaultsRelations

export const ServiceOptionalDefaultsWithRelationsSchema: z.ZodType<ServiceOptionalDefaultsWithRelations> = ServiceOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => ProfileOptionalDefaultsWithRelationsSchema),
  images: z.lazy(() => ServiceImageOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SERVICE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ServicePartialRelations = {
  user?: ProfilePartialWithRelations;
  images?: ServiceImagePartialWithRelations[];
};

export type ServicePartialWithRelations = z.infer<typeof ServicePartialSchema> & ServicePartialRelations

export const ServicePartialWithRelationsSchema: z.ZodType<ServicePartialWithRelations> = ServicePartialSchema.merge(z.object({
  user: z.lazy(() => ProfilePartialWithRelationsSchema),
  images: z.lazy(() => ServiceImagePartialWithRelationsSchema).array(),
})).partial()

export type ServiceOptionalDefaultsWithPartialRelations = z.infer<typeof ServiceOptionalDefaultsSchema> & ServicePartialRelations

export const ServiceOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ServiceOptionalDefaultsWithPartialRelations> = ServiceOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => ProfilePartialWithRelationsSchema),
  images: z.lazy(() => ServiceImagePartialWithRelationsSchema).array(),
}).partial())

export type ServiceWithPartialRelations = z.infer<typeof ServiceSchema> & ServicePartialRelations

export const ServiceWithPartialRelationsSchema: z.ZodType<ServiceWithPartialRelations> = ServiceSchema.merge(z.object({
  user: z.lazy(() => ProfilePartialWithRelationsSchema),
  images: z.lazy(() => ServiceImagePartialWithRelationsSchema).array(),
}).partial())

export default ServiceSchema;
