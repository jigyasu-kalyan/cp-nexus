'use client';

import useSWR from 'swr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

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
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Codeforces Handle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{data?.cfHandle || 'Not Linked'}</div>
                        <p className="text-xs text-muted-foreground">
                            Link accounts for unified stats.
                        </p>
                    </CardContent>
                </Card>
                
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