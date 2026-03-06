import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StatsService {
    async getDashboardStats() {
        const totalMatches = await prisma.match.count();

        // Top Games (by number of matches)
        // Group matches by game_id and count
        const matchesByGame = await prisma.match.groupBy({
            by: ['game_id'],
            _count: {
                _all: true
            },
            orderBy: {
                _count: {
                    game_id: 'desc'
                }
            },
            take: 5
        });

        // Resolve Game details for the top games
        const topGames = await Promise.all(matchesByGame.map(async (group) => {
            const game = await prisma.game.findUnique({
                where: { id: group.game_id },
                select: { id: true, name: true, image_url: true }
            });
            return {
                ...game,
                matchesPlayed: group._count._all
            };
        }));

        // Top Players (by wins)
        // Group match participants where is_winner = true
        const winsByPlayer = await prisma.matchParticipant.groupBy({
            by: ['player_id'],
            where: {
                is_winner: true
            },
            _count: {
                _all: true
            },
            orderBy: {
                _count: {
                    player_id: 'desc'
                }
            },
            take: 5
        });

        // Resolve Player details
        const topPlayers = await Promise.all(winsByPlayer.map(async (group) => {
            const player = await prisma.player.findUnique({
                where: { id: group.player_id },
                select: { id: true, name: true, avatar_color: true }
            });
            return {
                ...player,
                wins: group._count._all
            };
        }));

        return {
            totalMatches,
            topGames,
            topPlayers
        };
    }
}
