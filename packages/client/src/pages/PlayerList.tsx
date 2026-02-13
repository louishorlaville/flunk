import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Link } from 'react-router-dom';

// TODO: Export Player from shared
export interface Player {
    id: string;
    name: string;
    avatar_color: string;
    avatar_image_url: string | null;
    user_id: string;
}

export const PlayerList = () => {
    const queryClient = useQueryClient();
    const { data: players, isLoading, error } = useQuery<Player[]>({
        queryKey: ['players'],
        queryFn: async () => {
            const response = await api.get('/players');
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/players/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });

    if (isLoading) return <div className="text-center p-4">Loading players...</div>;
    if (error) return <div className="text-center text-red-500 p-4">Error loading players</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6 pl-2 pr-2">
                <h2 className="text-2xl font-bold">Player Directory</h2>
                <Link
                    to="/players/new"
                    className="bg-flunk-orange text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                    Add Player
                </Link>
            </div>

            {players && players.length === 0 ? (
                <p className="text-gray-500 text-center">No players found. Add your friends!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {players?.map((player) => (
                        <div key={player.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                            <div
                                className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-white text-3xl font-bold overflow-hidden"
                                style={{ backgroundColor: player.avatar_color }}
                            >
                                {player.avatar_image_url ? (
                                    <img src={player.avatar_image_url} alt={player.name} className="w-full h-full object-cover" />
                                ) : (
                                    player.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{player.name}</h3>
                            <div className="flex space-x-2 mt-2">
                                <Link
                                    to={`/players/${player.id}/edit`}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this player?')) {
                                            deleteMutation.mutate(player.id)
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
