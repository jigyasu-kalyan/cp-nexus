'use client';

import useSWR, { mutate } from 'swr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { ConnectCodeforces } from './ConnectCodeforces';
import { RatingChart } from './RatingChart';
import { ActivityHeatmap } from './ActivityHeatmap';
import { motion } from 'framer-motion';
import { ShinyText } from '@/components/ui/shiny-text';

// Define the shape of the data we expect from the backend API
interface DashboardData {
    username: string;
    cfHandle: string;
    totalProblemsSolved: number;
    lastSubmissionTime: string; // ISO string
}

const fetcher = async (path: string) => {
    // Use the api client which automatically includes JWT token in Authorization header
    const response = await api.get(path);
    return response.data;
};

export function DashboardDataFetcher() {
    // SWR will handle caching, revalidation, and error handling
    const { data, error, isLoading } = useSWR<DashboardData>('dashboard/stats', fetcher, {
        refreshInterval: 0
    });

    if (error) return <p className="text-red-500">Failed to load dashboard data.</p>;

    if (isLoading) {
        // Display loading state using shadcn/ui Skeleton
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
            </div>
        );
    }

    // Data is guaranteed to be present here
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold tracking-tight">
                    Hello, <ShinyText speed={3} className="text-white font-bold">{data?.username || 'Jigyasu'}</ShinyText>! 👋
                </h2>
                <p className="text-slate-400 mt-1">Here's your competitive programming overview.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm shadow-sm hover:border-slate-700 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Total Problems Solved
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{data?.totalProblemsSolved.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                Across all linked platforms.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    {data?.cfHandle ? (
                        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm shadow-sm hover:border-blue-900/30 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">
                                    Codeforces Handle
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-400">{data.cfHandle}</div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Account linked successfully.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-slate-700 hover:bg-slate-800 text-slate-300"
                                            onClick={async () => {
                                                try {
                                                    await api.post('/sync/codeforces');
                                                    mutate('dashboard/stats');
                                                    mutate('dashboard/rating');
                                                    mutate('dashboard/activity');
                                                    alert('Sync started! Data will update shortly.');
                                                } catch (e: any) {
                                                    console.error('Failed to sync', e);
                                                    const details = e?.response?.data?.details || e.message || 'Unknown error';
                                                    alert(`Failed to sync data: ${details}`);
                                                }
                                            }}
                                        >
                                            Sync Now
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="bg-red-900/20 hover:bg-red-900/40 text-red-300 border border-red-900/30"
                                            onClick={async () => {
                                                if (!confirm('Are you sure you want to unlink? This will delete all your Codeforces data.')) return;
                                                try {
                                                    await api.delete('/profiles/unlink/CODEFORCES');
                                                    mutate('dashboard/stats');
                                                } catch (e) {
                                                    console.error('Failed to unlink', e);
                                                    alert('Failed to unlink account.');
                                                }
                                            }}
                                        >
                                            Unlink
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <ConnectCodeforces />
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm shadow-sm hover:border-slate-700 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Last Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {data?.lastSubmissionTime ? new Date(data.lastSubmissionTime).toLocaleDateString() : 'N/A'}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Time of your most recent submission.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* New Charts Section */}
                <motion.div
                    className="col-span-1 md:col-span-3 space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <RatingChart />
                    <ActivityHeatmap />
                </motion.div>
            </div>
        </div>
    );
}

// NOTE: You need to install SWR: npm install swr