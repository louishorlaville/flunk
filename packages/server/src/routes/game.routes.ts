import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
const gameController = new GameController();

// Protect all game routes
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management
 */

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - min_players
 *               - max_players
 *               - scoring_type
 *             properties:
 *               name:
 *                 type: string
 *               image_url:
 *                 type: string
 *               min_players:
 *                 type: integer
 *               max_players:
 *                 type: integer
 *               scoring_type:
 *                 type: string
 *                 enum: [POINTS, WIN_LOSE, COOP]
 *     responses:
 *       201:
 *         description: Game created
 *       401:
 *         description: Unauthorized
 */
router.post('/', gameController.create);

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get all games
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of games
 */
router.get('/', gameController.getAll);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get a game by ID
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game details
 *       404:
 *         description: Game not found
 */
router.get('/:id', gameController.getOne);

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Update a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               min_players:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Game updated
 */
router.put('/:id', gameController.update);

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Delete a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Game deleted
 */
router.delete('/:id', gameController.delete);

export default router;
