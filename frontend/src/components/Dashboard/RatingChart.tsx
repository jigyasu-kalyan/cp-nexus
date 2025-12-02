'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useSWR from 'swr';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface RatingPoint {
    rating: number;
    date: string;
    contestName: string;
}

const fetcher = async (url: string) => {
    const response = await api.get(url);
    return response.data;
};

export function RatingChart() {
    const { data, error, isLoading } = useSWR<RatingPoint[]>('/dashboard/rating', fetcher);

    if (isLoading) {
        return <Skeleton className="w-full h-[300px] rounded-xl" />;
    }

    if (error || !data || data.length === 0) {
        return (
            <Card className="bg-black/50 border-white/10 backdrop-blur-sm shadow-sm hover:border-white/20 transition-colors">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-zinc-400">Rating History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] flex items-center justify-center text-slate-400">
                        {error ? 'Failed to load rating data.' : 'No rating history available.'}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-black/50 border-white/10 backdrop-blur-sm shadow-sm hover:border-white/20 transition-colors col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-400">Rating History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis
                                dataKey="date"
                                stroke="#888"
                                tick={{ fill: '#888' }}
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                            />
                            <YAxis
                                stroke="#fff"
                                tick={{ fill: '#888' }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                                itemStyle={{ color: '#60a5fa' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rating"
                                stroke="#fff"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
