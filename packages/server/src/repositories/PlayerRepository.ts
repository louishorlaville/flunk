import { Player } from '@prisma/client';
import { prisma } from '../prisma/client';
import { CreatePlayerDto, UpdatePlayerDto } from '@flunk/shared';

export class PlayerRepository {
    async create(userId: string, data: CreatePlayerDto): Promise<Player> {
        return prisma.player.create({
            data: {
                ...data,
                user_id: userId
            }
        });
    }

    async findAll(userId: string): Promise<Player[]> {
        return prisma.player.findMany({
            where: { user_id: userId }
        });
    }

    async findById(id: string): Promise<Player | null> {
        return prisma.player.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: UpdatePlayerDto): Promise<Player> {
        return prisma.player.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Player> {
        return prisma.player.delete({
            where: { id }
        });
    }
}
