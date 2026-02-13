import { Router } from 'express';
import { PlayerController } from '../controllers/PlayerController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
const playerController = new PlayerController();

// Protect all player routes
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player management
 */

/**
 * @swagger
 * /players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
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
 *             properties:
 *               name:
 *                 type: string
 *               avatar_color:
 *                 type: string
 *               avatar_image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Player created
 */
router.post('/', playerController.create);

/**
 * @swagger
 * /players:
 *   get:
 *     summary: Get all players for the authenticated user
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of players
 */
router.get('/', playerController.getAll);

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     summary: Get a player by ID
 *     tags: [Players]
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
 *         description: Player details
 *       404:
 *         description: Player not found
 */
router.get('/:id', playerController.getOne);

/**
 * @swagger
 * /players/{id}:
 *   put:
 *     summary: Update a player
 *     tags: [Players]
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
 *               avatar_color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player updated
 */
router.put('/:id', playerController.update);

/**
 * @swagger
 * /players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
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
 *         description: Player deleted
 */
router.delete('/:id', playerController.delete);

export default router;
