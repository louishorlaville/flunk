import { PlayerRepository } from '../repositories/PlayerRepository';
import { CreatePlayerDto, UpdatePlayerDto } from '@flunk/shared';
import { Player } from '@prisma/client';

export class PlayerService {
    private playerRepository: PlayerRepository;

    constructor() {
        this.playerRepository = new PlayerRepository();
    }

    async createPlayer(userId: string, data: CreatePlayerDto): Promise<Player> {
        return this.playerRepository.create(userId, data);
    }

    async getAllPlayers(userId: string): Promise<Player[]> {
        return this.playerRepository.findAll(userId);
    }

    async getPlayerById(id: string): Promise<Player | null> {
        return this.playerRepository.findById(id);
    }

    async updatePlayer(id: string, data: UpdatePlayerDto): Promise<Player> {
        return this.playerRepository.update(id, data);
    }

    async deletePlayer(id: string): Promise<Player> {
        return this.playerRepository.delete(id);
    }
}
