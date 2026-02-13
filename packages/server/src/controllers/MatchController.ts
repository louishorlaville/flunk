import { Request, Response, NextFunction } from 'express';
import { MatchService } from '../services/MatchService';
import { CreateMatchSchema } from '@flunk/shared';

const matchService = new MatchService();

export class MatchController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = CreateMatchSchema.parse(req.body);
            const match = await matchService.createMatch(validatedData);
            res.status(201).json(match);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const matches = await matchService.getAllMatches();
            res.json(matches);
        } catch (error) {
            next(error);
        }
    }
}
