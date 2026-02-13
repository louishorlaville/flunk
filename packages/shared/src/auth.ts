import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;

export const AuthResponseSchema = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string()
    })
});

export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
