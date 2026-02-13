import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateGameDto, CreateGameSchema, ScoringTypeSchema, Game } from '@flunk/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

// Manually define the DTO if shared type export is tricky in monorepo without strict type re-export
// But let's try to use the shared one first. If it fails build, we can fallback.

export const GameForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

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

    if (isEditMode && isLoadingGame) return <div className="text-center p-8">Loading game details...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Game' : 'Add New Game'}</h2>
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
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting || mutation.isPending ? 'Saving...' : (isEditMode ? 'Update Game' : 'Create Game')}
                    </button>
                </div>
            </form>
        </div>
    );
};
