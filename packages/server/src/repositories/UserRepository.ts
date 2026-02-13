import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '@flunk/shared';

import { prisma } from '../prisma/client';

export class UserRepository {
    async create(data: CreateUserDto): Promise<User> {
        return prisma.user.create({
            data: {
                email: data.email,
                password_hash: data.password // Hash before calling this or inside service? Service is better.
            }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id }
        });
    }
}
