import { MatchRepository } from '../repositories/MatchRepository';
import { CreateMatchDto } from '@flunk/shared';
import { Match } from '@prisma/client';

export class MatchService {
    private matchRepository: MatchRepository;

    constructor() {
        this.matchRepository = new MatchRepository();
    }

    async createMatch(data: CreateMatchDto): Promise<Match> {
        // Business logic: Evaluate winners based on scoring type?
        // For now, we trust the frontend/user input on who won.
        // In future iterations, we can fetch the Game's scoring_type and auto-calculate winners/validate scores.
        return await this.matchRepository.create(data);
    }

    async getAllMatches() {
        return await this.matchRepository.findAll();
    }
}
