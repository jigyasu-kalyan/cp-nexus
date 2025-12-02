'use client';

import useSWR, { mutate } from 'swr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { ConnectCodeforces } from './ConnectCodeforces';

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
            <h2 className="text-2xl font-semibold tracking-tight">
                Hello, {data?.username || 'Jigyasu'}!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Problems Solved
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalProblemsSolved.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all linked platforms.
                        </p>
                    </CardContent>
                </Card>

                {data?.cfHandle ? (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Codeforces Handle
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">{data.cfHandle}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Account linked successfully.
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
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
                        </CardContent>
                    </Card>
                ) : (
                    <ConnectCodeforces />
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Last Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.lastSubmissionTime ? new Date(data.lastSubmissionTime).toLocaleDateString() : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Time of your most recent submission.
                        </p>
                    </CardContent>
                </Card>
            </div>
            {/* We will add Heatmap/Charts here later */}
        </div>
    );
}

// NOTE: You need to install SWR: npm install swr