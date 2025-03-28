import { z } from 'zod';

export const ServiceScalarFieldEnumSchema = z.enum(['id','name','date','images','description','userId']);

export default ServiceScalarFieldEnumSchema;
