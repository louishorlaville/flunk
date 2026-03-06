import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
const statsController = new StatsController();

router.get('/', authenticateToken, statsController.getDashboardStats);

export default router;
