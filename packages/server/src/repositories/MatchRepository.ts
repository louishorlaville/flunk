import { Match } from '@prisma/client';
import { prisma } from '../prisma/client';
import { CreateMatchDto } from '@flunk/shared';

export class MatchRepository {
    async create(data: CreateMatchDto): Promise<Match> {
        const { gameId, participants, playedAt, notes } = data;

        // Use a transaction to create the match and all participants atomically
        return await prisma.$transaction(async (tx) => {
            const match = await tx.match.create({
                data: {
                    game_id: gameId,
                    date: playedAt,
                    notes: notes,
                    participants: {
                        create: participants.map((p) => ({
                            player_id: p.playerId,
                            score: p.score,
                            is_winner: p.isWinner,
                        })),
                    },
                },
                include: {
                    participants: true, // Return participants in the response
                },
            });

            return match;
        });
    }

    async findAll() {
        return await prisma.match.findMany({
            orderBy: { date: 'desc' },
            include: {
                game: true,
                participants: {
                    include: {
                        player: true
                    }
                }
            }
        });
    }
}
