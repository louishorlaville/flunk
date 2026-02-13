import { z } from 'zod';

export const ScoringTypeSchema = z.enum(['POINTS', 'WIN_LOSE', 'COOP']);
export type ScoringType = z.infer<typeof ScoringTypeSchema>;

export const CreateGameSchema = z.object({
    name: z.string().min(1, "Name is required"),
    image_url: z.string().url().optional().or(z.literal('')),
    min_players: z.number().min(1),
    max_players: z.number().min(1),
    scoring_type: ScoringTypeSchema
});

export type CreateGameDto = z.infer<typeof CreateGameSchema>;

// Manually defining Game interface to avoid Prisma dependency in shared for now
export interface Game {
    id: string;
    name: string;
    image_url: string | null;
    min_players: number;
    max_players: number;
    scoring_type: ScoringType;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}

export const UpdateGameSchema = CreateGameSchema.partial();
export type UpdateGameDto = z.infer<typeof UpdateGameSchema>;
