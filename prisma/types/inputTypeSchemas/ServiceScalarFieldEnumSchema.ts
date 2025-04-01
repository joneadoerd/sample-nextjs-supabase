import { z } from 'zod';

export const ServiceScalarFieldEnumSchema = z.enum(['id','name','date','description','userId','createdAt']);

export default ServiceScalarFieldEnumSchema;
