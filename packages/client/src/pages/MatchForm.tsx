import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateMatchDto, CreateMatchSchema, Game, Player } from '@flunk/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const MatchForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    // Fetch Games and Players
    const { data: games } = useQuery<Game[]>({ queryKey: ['games'], queryFn: async () => (await api.get('/games')).data });
    const { data: players } = useQuery<Player[]>({ queryKey: ['players'], queryFn: async () => (await api.get('/players')).data });

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateMatchDto>({
        resolver: zodResolver(CreateMatchSchema),
        defaultValues: {
            playedAt: new Date(),
            participants: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "participants"
    });

    const mutation = useMutation({
        mutationFn: (data: CreateMatchDto) => api.post('/matches', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            navigate('/matches');
        }
    });

    const handleGameSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const gameId = e.target.value;
        const game = games?.find(g => g.id === gameId) || null;
        setSelectedGame(game);
        setValue('gameId', gameId);
    };

    const handleAddParticipant = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const playerId = e.target.value;
        if (!playerId) return;

        // Prevent duplicate players
        const currentParticipants = watch('participants');
        if (currentParticipants.some(p => p.playerId === playerId)) return;

        append({ playerId, score: 0, isWinner: false });
        e.target.value = ""; // Reset select
    };

    const onSubmit = (data: CreateMatchDto) => {
        mutation.mutate(data);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">Log Match</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Game Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Game</label>
                    <select
                        onChange={handleGameSelect}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        defaultValue=""
                    >
                        <option value="" disabled>Select a game...</option>
                        {games?.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                    {errors.gameId && <p className="text-red-500 text-xs mt-1">{errors.gameId.message}</p>}
                </div>

                {selectedGame && (
                    <>
                        {/* Participants Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Add Players</label>
                            <select
                                onChange={handleAddParticipant}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                defaultValue=""
                            >
                                <option value="" disabled>Select player to add...</option>
                                {players?.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.participants && <p className="text-red-500 text-xs mt-1">{errors.participants.message}</p>}
                        </div>

                        {/* Participants List & Scoring */}
                        <div className="space-y-4">
                            {fields.map((field, index) => {
                                const participantId = watch(`participants.${index}.playerId`);
                                const player = players?.find(p => p.id === participantId);

                                return (
                                    <div key={field.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded border">
                                        <div className="flex items-center gap-2 w-1/3">
                                            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs" style={{ backgroundColor: player?.avatar_color || '#ccc' }}>
                                                {player?.name[0]}
                                            </div>
                                            <span className="font-medium truncate">{player?.name}</span>
                                        </div>

                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 block">Score</label>
                                            <input
                                                type="number"
                                                {...register(`participants.${index}.score`, { valueAsNumber: true })}
                                                className="w-full border rounded p-1"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                {...register(`participants.${index}.isWinner`)}
                                                id={`winner-${index}`}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`winner-${index}`} className="text-sm cursor-pointer select-none">Winner</label>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date Played</label>
                            <input
                                type="date"
                                {...register('playedAt', { valueAsDate: true })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea
                                {...register('notes')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                            >
                                Save Match
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};
