import { z } from 'zod';

export const MatchParticipantSchema = z.object({
    playerId: z.string().uuid(),
    score: z.number(),
    isWinner: z.boolean().default(false),
});

export const CreateMatchSchema = z.object({
    gameId: z.string().uuid(),
    playedAt: z.coerce.date().default(() => new Date()), // Allow string or date input
    participants: z.array(MatchParticipantSchema).min(1, "At least one participant is required"),
    notes: z.string().optional(),
});

export type CreateMatchDto = z.infer<typeof CreateMatchSchema>;
export type MatchParticipantDto = z.infer<typeof MatchParticipantSchema>;

// Manually define Match interface for frontend/backend consistency without Prisma
export interface MatchParticipant {
    id: string;
    match_id: string;
    player_id: string;
    score: number;
    is_winner: boolean;
}

export interface Match {
    id: string;
    game_id: string;
    date: Date;
    notes: string | null;
    created_at: Date;
    participants?: MatchParticipant[];
}
