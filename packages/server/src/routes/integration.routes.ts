import { Router } from 'express';
import { IntegrationController } from '../controllers/IntegrationController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
const integrationController = new IntegrationController();

// Protect integration routes
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Integrations
 *   description: External API integrations
 */

/**
 * @swagger
 * /integrations/bgg/search:
 *   get:
 *     summary: Search games on BoardGameGeek
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of games from BGG
 */
router.get('/bgg/search', integrationController.searchBgg);

export default router;
