import { Game } from '@prisma/client';
import { prisma } from '../prisma/client';
import { CreateGameDto, UpdateGameDto } from '@flunk/shared';

export class GameRepository {
    async create(userId: string, data: CreateGameDto): Promise<Game> {
        return prisma.game.create({
            data: {
                ...data,
                created_by: userId
            }
        });
    }

    async findAll(): Promise<Game[]> {
        return prisma.game.findMany();
    }

    async findById(id: string): Promise<Game | null> {
        return prisma.game.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: UpdateGameDto): Promise<Game> {
        return prisma.game.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Game> {
        return prisma.game.delete({
            where: { id }
        });
    }
}
