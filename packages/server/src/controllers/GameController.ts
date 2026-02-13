import { Response, NextFunction } from 'express';
import { GameService } from '../services/GameService';
import { CreateGameSchema, UpdateGameSchema } from '@flunk/shared';
import { AuthRequest } from '../middlewares/authMiddleware';

const gameService = new GameService();

export class GameController {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const validatedData = CreateGameSchema.parse(req.body);
            const game = await gameService.createGame(userId, validatedData);
            res.status(201).json(game);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const games = await gameService.getAllGames();
            res.json(games);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const game = await gameService.getGameById(req.params.id);
            if (!game) {
                return res.status(404).json({ message: 'Game not found' });
            }
            res.json(game);
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = UpdateGameSchema.parse(req.body);
            const game = await gameService.updateGame(req.params.id, validatedData);
            res.json(game);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await gameService.deleteGame(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
