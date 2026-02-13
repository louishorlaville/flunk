import { Response, NextFunction } from 'express';
import { PlayerService } from '../services/PlayerService';
import { CreatePlayerSchema, UpdatePlayerSchema } from '@flunk/shared';
import { AuthRequest } from '../middlewares/authMiddleware';

const playerService = new PlayerService();

export class PlayerController {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const validatedData = CreatePlayerSchema.parse(req.body);
            const player = await playerService.createPlayer(userId, validatedData);
            res.status(201).json(player);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const players = await playerService.getAllPlayers(userId);
            res.json(players);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const player = await playerService.getPlayerById(req.params.id);
            if (!player) {
                return res.status(404).json({ message: 'Player not found' });
            }
            // Optional: Check if player belongs to user
            if (player.user_id !== req.user!.userId) {
                return res.status(403).json({ message: 'Unauthorized access to this player' });
            }
            res.json(player);
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // Logic check for ownership should ideally be here or in service
            const player = await playerService.getPlayerById(req.params.id);
            if (!player) return res.status(404).json({ message: 'Player not found' });
            if (player.user_id !== req.user!.userId) return res.status(403).json({ message: 'Unauthorized' });

            const validatedData = UpdatePlayerSchema.parse(req.body);
            const updatedPlayer = await playerService.updatePlayer(req.params.id, validatedData);
            res.json(updatedPlayer);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const player = await playerService.getPlayerById(req.params.id);
            if (!player) return res.status(404).json({ message: 'Player not found' });
            if (player.user_id !== req.user!.userId) return res.status(403).json({ message: 'Unauthorized' });

            await playerService.deletePlayer(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
