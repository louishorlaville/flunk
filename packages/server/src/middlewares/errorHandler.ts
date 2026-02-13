import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors
        });
    }

    if (err.message === 'User already exists' || err.message === 'Invalid credentials') {
        return res.status(401).json({ message: err.message });
    }

    res.status(500).json({ message: 'Internal Server Error' });
};
