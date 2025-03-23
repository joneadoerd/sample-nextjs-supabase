import { z } from 'zod';
import { RoleSchema } from '../inputTypeSchemas/RoleSchema'

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
  role: RoleSchema,
  id: z.string(),
  name: z.string(),
  email: z.string(),
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
}))

export type ProfileOptionalDefaults = z.infer<typeof ProfileOptionalDefaultsSchema>

export default ProfileSchema;
