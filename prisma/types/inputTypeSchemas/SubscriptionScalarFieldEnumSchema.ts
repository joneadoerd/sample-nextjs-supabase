import { z } from 'zod';

export const SubscriptionScalarFieldEnumSchema = z.enum(['id','start_date','expire_date','status_subscription','userId']);

export default SubscriptionScalarFieldEnumSchema;
