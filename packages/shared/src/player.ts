import { z } from 'zod';

// Manually defining Player interface to avoid Prisma dependency in shared for now
export interface Player {
    id: string;
    name: string;
    avatar_color: string;
    avatar_image_url: string | null;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}

export const CreatePlayerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    avatar_color: z.string().regex(/^#[0-9a-fA-F]{6}$/i, "Invalid color hex").default("#000000"),
    avatar_image_url: z.string().url().optional().or(z.literal(''))
});

export type CreatePlayerDto = z.infer<typeof CreatePlayerSchema>;

export const UpdatePlayerSchema = CreatePlayerSchema.partial();
export type UpdatePlayerDto = z.infer<typeof UpdatePlayerSchema>;
