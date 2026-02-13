import { z } from 'zod';

export const CreatePlayerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    avatar_color: z.string().regex(/^#[0-9a-fA-F]{6}$/i, "Invalid color hex").default("#000000"),
    avatar_image_url: z.string().url().optional().or(z.literal(''))
});

export type CreatePlayerDto = z.infer<typeof CreatePlayerSchema>;

export const UpdatePlayerSchema = CreatePlayerSchema.partial();
export type UpdatePlayerDto = z.infer<typeof UpdatePlayerSchema>;
