import { Response, NextFunction } from 'express';
import { StatsService } from '../services/StatsService';
import { AuthRequest } from '../middlewares/authMiddleware';

const statsService = new StatsService();

export class StatsController {
    async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const stats = await statsService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}
