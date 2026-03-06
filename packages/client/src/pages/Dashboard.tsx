import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
    totalMatches: number;
    topGames: {
        id: string;
        name: string;
        image_url: string | null;
        matchesPlayed: number;
    }[];
    topPlayers: {
        id: string;
        name: string;
        avatar_color: string;
        wins: number;
    }[];
}

export const Dashboard = () => {
    const { data: stats, isLoading, error } = useQuery<DashboardStats>({
        queryKey: ['stats'],
        queryFn: async () => (await api.get('/stats')).data
    });

    if (isLoading) return <div className="text-center p-8">Loading stats...</div>;
    if (error) return <div className="text-center text-red-500 p-8">Error loading stats.</div>;

    return (
        <div className="container mx-auto pb-20 md:pb-8">
            <h1 className="text-2xl font-bold text-flunk-blue mb-6">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Matches</h3>
                    <p className="text-4xl font-bold text-flunk-blue mt-2">{stats?.totalMatches}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Games Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-bold mb-4">Most Played Games</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.topGames}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" hide />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f3f4f6' }}
                                />
                                <Bar dataKey="matchesPlayed" fill="#F07E21" radius={[4, 4, 0, 0]} name="Matches" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Players List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-bold mb-4">Top Winners</h3>
                    <div className="space-y-4">
                        {stats?.topPlayers.map((player, index) => (
                            <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="font-bold text-gray-400 w-6">#{index + 1}</div>
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                                        style={{ backgroundColor: player.avatar_color }}
                                    >
                                        {player.name[0].toUpperCase()}
                                    </div>
                                    <span className="font-medium text-flunk-blue">{player.name}</span>
                                </div>
                                <div className="font-bold text-flunk-orange">
                                    {player.wins} <span className="text-xs text-gray-400 font-normal">wins</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
