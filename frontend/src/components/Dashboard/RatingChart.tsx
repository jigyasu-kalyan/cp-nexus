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
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-slate-200">Rating History</CardTitle>
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
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle className="text-slate-200">Rating History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8' }}
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8' }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                                itemStyle={{ color: '#60a5fa' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rating"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
