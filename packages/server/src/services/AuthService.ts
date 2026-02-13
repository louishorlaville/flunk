import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDto, LoginUserDto, AuthResponseDto } from '@flunk/shared';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(data: CreateUserDto): Promise<AuthResponseDto> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword
        });

        const token = this.generateToken(user.id);

        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }

    async login(data: LoginUserDto): Promise<AuthResponseDto> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user.id);

        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }

    private generateToken(userId: string): string {
        return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d'
        });
    }
}
