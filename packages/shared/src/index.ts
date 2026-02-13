import { z } from 'zod';

// Example export
export const hello = "world";

export * from './auth';
export * from './game';
export * from './player';

// Common Zod schemas placeholder
export const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});
