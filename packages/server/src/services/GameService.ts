import { GameRepository } from '../repositories/GameRepository';
import { CreateGameDto, UpdateGameDto } from '@flunk/shared';
import { Game } from '@prisma/client';

export class GameService {
    private gameRepository: GameRepository;

    constructor() {
        this.gameRepository = new GameRepository();
    }

    async createGame(userId: string, data: CreateGameDto): Promise<Game> {
        return this.gameRepository.create(userId, data);
    }

    async getAllGames(): Promise<Game[]> {
        return this.gameRepository.findAll();
    }

    async getGameById(id: string): Promise<Game | null> {
        return this.gameRepository.findById(id);
    }

    async updateGame(id: string, data: UpdateGameDto): Promise<Game> {
        return this.gameRepository.update(id, data);
    }

    async deleteGame(id: string): Promise<Game> {
        return this.gameRepository.delete(id);
    }
}
