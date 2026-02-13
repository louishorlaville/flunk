import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Game } from '@flunk/shared';

export const GameList = () => {
    const queryClient = useQueryClient();
    const { data: games, isLoading, error } = useQuery<Game[]>({
        queryKey: ['games'],
        queryFn: async () => {
            const response = await api.get('/games');
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/games/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
    });

    if (isLoading) return <div className="text-center p-4">Loading games...</div>;
    if (error) return <div className="text-center text-red-500 p-4">Error loading games</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6 pl-2 pr-2">
                <h2 className="text-2xl font-bold">Games Library</h2>
                <Link
                    to="/games/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Add Game
                </Link>
            </div>

            {games && games.length === 0 ? (
                <p className="text-gray-500 text-center">No games found. Add your first one!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games?.map((game) => (
                        <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            {game.image_url && (
                                <img
                                    src={game.image_url}
                                    alt={game.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                                <div className="flex justify-between text-sm text-gray-600 mb-4">
                                    <span>{game.min_players}-{game.max_players} Players</span>
                                    <span className="bg-gray-200 px-2 py-1 rounded text-xs">{game.scoring_type}</span>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        to={`/games/${game.id}/edit`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this game?')) {
                                                deleteMutation.mutate(game.id)
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
