import { z } from 'zod';
import { ServiceWithRelationsSchema, ServicePartialWithRelationsSchema, ServiceOptionalDefaultsWithRelationsSchema } from './ServiceSchema'
import type { ServiceWithRelations, ServicePartialWithRelations, ServiceOptionalDefaultsWithRelations } from './ServiceSchema'

/////////////////////////////////////////
// SERVICE IMAGE SCHEMA
/////////////////////////////////////////

export const ServiceImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  serviceId: z.string(),
})

export type ServiceImage = z.infer<typeof ServiceImageSchema>

/////////////////////////////////////////
// SERVICE IMAGE PARTIAL SCHEMA
/////////////////////////////////////////

export const ServiceImagePartialSchema = ServiceImageSchema.partial()

export type ServiceImagePartial = z.infer<typeof ServiceImagePartialSchema>

/////////////////////////////////////////
// SERVICE IMAGE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ServiceImageOptionalDefaultsSchema = ServiceImageSchema.merge(z.object({
  id: z.string().optional(),
}))

export type ServiceImageOptionalDefaults = z.infer<typeof ServiceImageOptionalDefaultsSchema>

/////////////////////////////////////////
// SERVICE IMAGE RELATION SCHEMA
/////////////////////////////////////////

export type ServiceImageRelations = {
  service: ServiceWithRelations;
};

export type ServiceImageWithRelations = z.infer<typeof ServiceImageSchema> & ServiceImageRelations

export const ServiceImageWithRelationsSchema: z.ZodType<ServiceImageWithRelations> = ServiceImageSchema.merge(z.object({
  service: z.lazy(() => ServiceWithRelationsSchema),
}))

/////////////////////////////////////////
// SERVICE IMAGE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ServiceImageOptionalDefaultsRelations = {
  service: ServiceOptionalDefaultsWithRelations;
};

export type ServiceImageOptionalDefaultsWithRelations = z.infer<typeof ServiceImageOptionalDefaultsSchema> & ServiceImageOptionalDefaultsRelations

export const ServiceImageOptionalDefaultsWithRelationsSchema: z.ZodType<ServiceImageOptionalDefaultsWithRelations> = ServiceImageOptionalDefaultsSchema.merge(z.object({
  service: z.lazy(() => ServiceOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// SERVICE IMAGE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ServiceImagePartialRelations = {
  service?: ServicePartialWithRelations;
};

export type ServiceImagePartialWithRelations = z.infer<typeof ServiceImagePartialSchema> & ServiceImagePartialRelations

export const ServiceImagePartialWithRelationsSchema: z.ZodType<ServiceImagePartialWithRelations> = ServiceImagePartialSchema.merge(z.object({
  service: z.lazy(() => ServicePartialWithRelationsSchema),
})).partial()

export type ServiceImageOptionalDefaultsWithPartialRelations = z.infer<typeof ServiceImageOptionalDefaultsSchema> & ServiceImagePartialRelations

export const ServiceImageOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ServiceImageOptionalDefaultsWithPartialRelations> = ServiceImageOptionalDefaultsSchema.merge(z.object({
  service: z.lazy(() => ServicePartialWithRelationsSchema),
}).partial())

export type ServiceImageWithPartialRelations = z.infer<typeof ServiceImageSchema> & ServiceImagePartialRelations

export const ServiceImageWithPartialRelationsSchema: z.ZodType<ServiceImageWithPartialRelations> = ServiceImageSchema.merge(z.object({
  service: z.lazy(() => ServicePartialWithRelationsSchema),
}).partial())

export default ServiceImageSchema;
