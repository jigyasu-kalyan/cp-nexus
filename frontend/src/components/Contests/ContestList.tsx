'use client';

import useSWR from 'swr';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface Contest {
    id: number;
    name: string;
    type: string;
    phase: string;
    frozen: boolean;
    durationSeconds: number;
    startTimeSeconds: number;
    relativeTimeSeconds: number;
}

const fetcher = async (path: string) => {
    const response = await api.get(path);
    return response.data;
};

export function ContestList() {
    const { data: contests, error, isLoading } = useSWR<Contest[]>('/contests', fetcher);

    if (error) return <div className="text-red-400">Failed to load contests</div>;

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full bg-slate-800/50" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {contests?.map((contest, index) => {
                const startDate = new Date(contest.startTimeSeconds * 1000);
                const durationHours = (contest.durationSeconds / 3600).toFixed(1);

                return (
                    <motion.div
                        key={contest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur hover:border-blue-500/30 transition-colors">
                            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-200 mb-1">
                                        {contest.name}
                                    </h3>
                                    <div className="flex gap-4 text-sm text-slate-400">
                                        <span>{contest.type}</span>
                                        <span>•</span>
                                        <span>{durationHours} hours</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end min-w-[140px]">
                                    <div className="text-blue-400 font-medium">
                                        {startDate.toLocaleDateString()}
                                    </div>
                                    <div className="text-slate-500 text-sm">
                                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
