import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export interface BggGameResult {
    id: string;
    name: string;
    yearPublished?: string;
    minPlayers?: number;
    maxPlayers?: number;
    playingTime?: number;
    thumbnail?: string;
    image?: string;
    description?: string;
    mechanics?: string[];
}

export class BggService {
    private readonly BASE_URL = 'https://boardgamegeek.com/xmlapi2';

    async searchGames(query: string): Promise<BggGameResult[]> {
        try {
            const response = await axios.get(`${this.BASE_URL}/search`, {
                params: { query, type: 'boardgame' }
            });

            const result = await parseStringPromise(response.data);
            if (!result.items.item) return [];

            // BGG Search only returns basic info (id, name, year).
            // We often need a second call to 'thing' to get details (images, players count)
            // For efficiency, let's just return IDs and basic info first,
            // OR fetch details for the top X results.
            // Let's mapping basic info first.

            const items = Array.isArray(result.items.item) ? result.items.item : [result.items.item];

            return items.map((item: any) => ({
                id: item.$.id,
                name: item.name[0].$.value,
                yearPublished: item.yearpublished ? item.yearpublished[0].$.value : undefined
            }));
        } catch (error) {
            console.error('Error searching BGG:', error);
            throw new Error('Failed to search BGG');
        }
    }

    async getGameDetails(ids: string[]): Promise<BggGameResult[]> {
        if (ids.length === 0) return [];

        try {
            const response = await axios.get(`${this.BASE_URL}/thing`, {
                params: { id: ids.join(',') }
            });

            const result = await parseStringPromise(response.data);
            if (!result.items.item) return [];

            const items = Array.isArray(result.items.item) ? result.items.item : [result.items.item];

            return items.map((item: any) => {
                const mechanics = item.link
                    ? item.link.filter((l: any) => l.$.type === 'boardgamemechanic').map((l: any) => l.$.value)
                    : [];

                return {
                    id: item.$.id,
                    name: Array.isArray(item.name) ? item.name.find((n: any) => n.$.type === 'primary').$.value : item.name[0].$.value,
                    yearPublished: item.yearpublished ? item.yearpublished[0].$.value : undefined,
                    minPlayers: item.minplayers ? parseInt(item.minplayers[0].$.value) : undefined,
                    maxPlayers: item.maxplayers ? parseInt(item.maxplayers[0].$.value) : undefined,
                    thumbnail: item.thumbnail ? item.thumbnail[0] : undefined,
                    image: item.image ? item.image[0] : undefined,
                    description: item.description ? item.description[0] : undefined,
                    mechanics
                };
            });

        } catch (error) {
            console.error('Error fetching BGG details:', error);
            throw new Error('Failed to fetch BGG details');
        }
    }
}
