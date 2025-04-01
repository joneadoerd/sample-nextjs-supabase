import { z } from 'zod';

export const ProfileScalarFieldEnumSchema = z.enum(['id','name','email','role','createdAt']);

export default ProfileScalarFieldEnumSchema;
