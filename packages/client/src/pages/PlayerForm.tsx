import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePlayerDto, CreatePlayerSchema } from '@flunk/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

// Shared type placeholder
export interface Player {
    id: string;
    name: string;
    avatar_color: string;
    avatar_image_url: string | null;
    user_id: string;
}

export const PlayerForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: playerData, isLoading: isLoadingPlayer } = useQuery<Player>({
        queryKey: ['player', id],
        queryFn: async () => {
            if (!id) return null;
            const res = await api.get(`/players/${id}`);
            return res.data;
        },
        enabled: isEditMode
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreatePlayerDto>({
        resolver: zodResolver(CreatePlayerSchema),
        defaultValues: {
            name: '',
            avatar_color: '#000000',
            avatar_image_url: ''
        }
    });

    useEffect(() => {
        if (playerData) {
            reset({
                name: playerData.name,
                avatar_color: playerData.avatar_color,
                avatar_image_url: playerData.avatar_image_url || ''
            });
        }
    }, [playerData, reset]);

    const mutation = useMutation({
        mutationFn: async (data: CreatePlayerDto) => {
            if (isEditMode) {
                return api.put(`/players/${id}`, data);
            }
            return api.post('/players', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
            navigate('/players');
        },
    });

    const onSubmit = (data: CreatePlayerDto) => {
        mutation.mutate(data);
    };

    if (isEditMode && isLoadingPlayer) return <div className="text-center p-8">Loading player details...</div>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Player' : 'Add New Player'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        {...register('name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Avatar Color</label>
                    <input
                        type="color"
                        {...register('avatar_color')}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-1"
                    />
                    {errors.avatar_color && <p className="text-red-500 text-xs mt-1">{errors.avatar_color.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Avatar Image URL (Optional)</label>
                    <input
                        {...register('avatar_image_url')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        placeholder="https://example.com/avatar.jpg"
                    />
                    {errors.avatar_image_url && <p className="text-red-500 text-xs mt-1">{errors.avatar_image_url.message}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/players')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 from-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || mutation.isPending}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-flunk-blue hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flunk-blue disabled:opacity-50 transition"
                    >
                        {isSubmitting || mutation.isPending ? 'Saving...' : (isEditMode ? 'Update Player' : 'Create Player')}
                    </button>
                </div>
            </form>
        </div>
    );
};
