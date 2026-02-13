import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateGameDto, CreateGameSchema, ScoringTypeSchema, Game } from '@flunk/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// BGG Result Interface (Should match backend)
interface BggGameResult {
    id: string;
    name: string;
    yearPublished?: string;
    minPlayers?: number;
    maxPlayers?: number;
    thumbnail?: string;
    image?: string;
    mechanics?: string[];
}

export const GameForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // BGG Search State
    const [bggQuery, setBggQuery] = useState('');
    const [isSearchingBgg, setIsSearchingBgg] = useState(false);
    const [bggResults, setBggResults] = useState<BggGameResult[]>([]);
    const [showBggSearch, setShowBggSearch] = useState(!isEditMode); // Default open on create

    // Fetch game data if in edit mode
    const { data: gameData, isLoading: isLoadingGame } = useQuery<Game>({
        queryKey: ['game', id],
        queryFn: async () => {
            if (!id) return null;
            const res = await api.get(`/games/${id}`);
            return res.data;
        },
        enabled: isEditMode
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateGameDto>({
        resolver: zodResolver(CreateGameSchema),
        defaultValues: {
            name: '',
            min_players: 1,
            max_players: 4,
            scoring_type: 'POINTS',
            image_url: ''
        }
    });

    useEffect(() => {
        if (gameData) {
            reset({
                name: gameData.name,
                min_players: gameData.min_players,
                max_players: gameData.max_players,
                scoring_type: gameData.scoring_type,
                image_url: gameData.image_url || ''
            });
            setShowBggSearch(false);
        }
    }, [gameData, reset]);

    const mutation = useMutation({
        mutationFn: async (data: CreateGameDto) => {
            if (isEditMode) {
                return api.put(`/games/${id}`, data);
            }
            return api.post('/games', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            navigate('/');
        },
    });

    const onSubmit = (data: CreateGameDto) => {
        mutation.mutate(data);
    };

    const handleBggSearch = async () => {
        if (!bggQuery.trim()) return;
        setIsSearchingBgg(true);
        try {
            const res = await api.get(`/integrations/bgg/search?q=${encodeURIComponent(bggQuery)}`);
            setBggResults(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to search BGG');
        } finally {
            setIsSearchingBgg(false);
        }
    };

    const selectBggGame = (game: BggGameResult) => {
        setValue('name', game.name);
        if (game.minPlayers) setValue('min_players', game.minPlayers);
        if (game.maxPlayers) setValue('max_players', game.maxPlayers);
        if (game.image) setValue('image_url', game.image);

        // Attempt to guess scoring type
        if (game.mechanics && game.mechanics.includes('Cooperative Game')) {
            setValue('scoring_type', 'COOP');
        } else {
            setValue('scoring_type', 'POINTS');
        }

        setBggResults([]);
        setShowBggSearch(false);
    };

    if (isEditMode && isLoadingGame) return <div className="text-center p-8">Loading game details...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Game' : 'Add New Game'}</h2>

            {!isEditMode && (
                <div className="mb-8 border-b pb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Import from BoardGameGeek</h3>
                        <button
                            type="button"
                            onClick={() => setShowBggSearch(!showBggSearch)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            {showBggSearch ? 'Hide Search' : 'Show Search'}
                        </button>
                    </div>

                    {showBggSearch && (
                        <div>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={bggQuery}
                                    onChange={(e) => setBggQuery(e.target.value)}
                                    placeholder="Search BGG (e.g. Catan)"
                                    className="flex-1 rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleBggSearch()}
                                />
                                <button
                                    type="button"
                                    onClick={handleBggSearch}
                                    disabled={isSearchingBgg}
                                    className="bg-flunk-blue text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                                >
                                    {isSearchingBgg ? 'Searching...' : 'Search'}
                                </button>
                            </div>

                            {bggResults.length > 0 && (
                                <div className="bg-gray-50 border rounded-md max-h-60 overflow-y-auto">
                                    {bggResults.map((game) => (
                                        <div
                                            key={game.id}
                                            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b last:border-0"
                                            onClick={() => selectBggGame(game)}
                                        >
                                            {game.thumbnail ? (
                                                <img src={game.thumbnail} alt={game.name} className="w-10 h-10 object-cover rounded" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs">No Img</div>
                                            )}
                                            <div>
                                                <div className="font-semibold">{game.name} {game.yearPublished && <span className="text-gray-500 font-normal">({game.yearPublished})</span>}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        {...register('name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Min Players</label>
                        <input
                            type="number"
                            {...register('min_players', { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                        {errors.min_players && <p className="text-red-500 text-xs mt-1">{errors.min_players.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Players</label>
                        <input
                            type="number"
                            {...register('max_players', { valueAsNumber: true })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                        {errors.max_players && <p className="text-red-500 text-xs mt-1">{errors.max_players.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Scoring Type</label>
                    <select
                        {...register('scoring_type')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        {ScoringTypeSchema.options.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.scoring_type && <p className="text-red-500 text-xs mt-1">{errors.scoring_type.message}</p>}
                    <p className="text-xs text-gray-500 mt-1">If imported, we guessed this. Feel free to change it.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                    <input
                        {...register('image_url')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        placeholder="https://example.com/image.jpg"
                    />
                    {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 from-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || mutation.isPending}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-flunk-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flunk-orange disabled:opacity-50 transition"
                    >
                        {isSubmitting || mutation.isPending ? 'Saving...' : (isEditMode ? 'Update Game' : 'Save to Library')}
                    </button>
                </div>
            </form>
        </div>
    );
};
