import { Router } from 'express';
import { MatchController } from '../controllers/MatchController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
const matchController = new MatchController();

// Protect all match routes
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: Match management
 */

/**
 * @swagger
 * /matches:
 *   post:
 *     summary: Create a new match record
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMatch'
 *     responses:
 *       201:
 *         description: Match created successfully
 */
router.post('/', matchController.create);

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Get all matches for the current user
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matches
 */
router.get('/', matchController.getAll);

export default router;
