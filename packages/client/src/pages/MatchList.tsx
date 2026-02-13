import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Link } from 'react-router-dom';

// Placeholder until we export this from shared
interface Match {
    id: string;
    game: { name: string; image_url: string | null };
    date: string;
    participants: {
        player: { name: string; avatar_color: string };
        score: number;
        is_winner: boolean;
    }[];
}

export const MatchList = () => {
    const { data: matches, isLoading, error } = useQuery<Match[]>({
        queryKey: ['matches'],
        queryFn: async () => {
            const res = await api.get('/matches');
            return res.data;
        }
    });

    if (isLoading) return <div className="p-4 text-center">Loading matches...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error loading matches</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6 pl-2 pr-2">
                <h2 className="text-2xl font-bold">Match History</h2>
                <Link
                    to="/matches/new"
                    className="bg-flunk-orange text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                    Log Match
                </Link>
            </div>

            <div className="space-y-4">
                {matches?.map(match => (
                    <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex items-center gap-3 w-full md:w-1/4">
                            {match.game.image_url ? (
                                <img src={match.game.image_url} alt={match.game.name} className="w-12 h-12 rounded object-cover" />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                            )}
                            <div>
                                <h3 className="font-bold text-flunk-blue">{match.game.name}</h3>
                                <span className="text-sm text-gray-400">{new Date(match.date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full overflow-x-auto">
                            <div className="flex gap-4">
                                {match.participants.map((p, idx) => (
                                    <div key={idx} className={`flex items-center gap-2 px-3 py-1 rounded-full border ${p.is_winner ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs shadow-sm" style={{ backgroundColor: p.player.avatar_color }}>
                                            {p.player.name[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium ${p.is_winner ? 'text-flunk-orange' : 'text-gray-600'}`}>{p.player.name}</span>
                                            <span className="text-xs text-gray-400">{p.score} pts</span>
                                        </div>
                                        {p.is_winner && <span className="text-flunk-orange">👑</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
