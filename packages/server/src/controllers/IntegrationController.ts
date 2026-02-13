import { Request, Response, NextFunction } from 'express';
import { BggService } from '../services/BggService';

const bggService = new BggService();

export class IntegrationController {
    async searchBgg(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.q as string;
            if (!query) {
                return res.status(400).json({ message: 'Query parameter "q" is required' });
            }

            // Step 1: Search for games
            const searchResults = await bggService.searchGames(query);

            // Step 2: Get details for top 5 results to allow rich display (images, player counts)
            // Limit to 5-10 to avoid hitting API limits or slow response
            const topIds = searchResults.slice(0, 5).map(g => g.id);

            const detailedResults = await bggService.getGameDetails(topIds);

            res.json(detailedResults);
        } catch (error) {
            next(error);
        }
    }
}
