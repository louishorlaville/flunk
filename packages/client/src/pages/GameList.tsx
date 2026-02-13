import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Game } from '@flunk/shared';
import { useState } from 'react';

export const GameList = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSortMenu, setShowSortMenu] = useState(false); // To implement sorting logic later

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

    const filteredGames = games?.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <div className="text-center p-4">Loading games...</div>;
    if (error) return <div className="text-center text-red-500 p-4">Error loading games</div>;

    return (
        <div className="container mx-auto pb-20 md:pb-4">
            {/* Custom Header / Action Bar */}
            <div className="flex items-center justify-between gap-4 mb-6 sticky top-0 bg-white z-10 py-2">
                {/* Friends / Filter Button (Mirrored Sort Icon) */}


                {/* Search Bar */}
                <div className="flex-1 flex items-center border-b-2 border-gray-200 focus-within:border-flunk-orange transition-colors">
                    <div className="pl-0 flex items-center pointer-events-none">
                        {/* Pacman Icon (Search Bar Asset) */}
                        <img src="/assets/search-bar.png" alt="Search" className="w-8 h-8 object-contain" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search your collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full px-3 py-2 border-none bg-transparent placeholder-gray-400 focus:ring-0 sm:text-lg outline-none ring-0"
                    />
                </div>

                {/* Sort Button */}
                <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <img src="/assets/sort.png" alt="Sort" className="w-6 h-6 object-contain" />
                </button>
            </div>


            {/* Content */}
            {filteredGames && filteredGames.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">No games found.</p>
                    <Link
                        to="/games/new"
                        className="inline-block bg-flunk-orange text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-orange-600 transition"
                    >
                        Add your first game
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames?.map((game) => (
                        <div key={game.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className="relative h-48">
                                {game.image_url ? (
                                    <img
                                        src={game.image_url}
                                        alt={game.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-flunk-blue shadow-sm">
                                    {game.scoring_type}
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-bold text-flunk-blue mb-1">{game.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{game.min_players}-{game.max_players} Players</p>

                                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                                    <Link
                                        to={`/games/${game.id}/edit`}
                                        className="text-sm font-medium text-flunk-blue hover:text-flunk-orange transition"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this game?')) {
                                                deleteMutation.mutate(game.id)
                                            }
                                        }}
                                        className="text-sm font-medium text-red-500 hover:text-red-700 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Action Button (FAB) for adding games (Mobile/Desktop) */}
            {filteredGames && filteredGames.length > 0 && (
                <Link
                    to="/games/new"
                    className="fixed bottom-20 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-flunk-orange text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition z-20"
                    title="Add Game"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </Link>
            )}
        </div>
    );
};
