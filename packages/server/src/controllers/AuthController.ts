import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { CreateUserSchema, LoginUserSchema } from '@flunk/shared';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = CreateUserSchema.parse(req.body);
            const result = await authService.register(validatedData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = LoginUserSchema.parse(req.body);
            const result = await authService.login(validatedData);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
