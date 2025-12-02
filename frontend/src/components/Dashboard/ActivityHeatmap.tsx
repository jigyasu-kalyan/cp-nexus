'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import useSWR from 'swr';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface ActivityPoint {
    date: string;
    count: number;
}

const fetcher = async (url: string) => {
    const response = await api.get(url);
    return response.data;
};

export function ActivityHeatmap() {
    const { data, error, isLoading } = useSWR<ActivityPoint[]>('/dashboard/activity', fetcher);

    if (isLoading) {
        return <Skeleton className="w-full h-[200px] rounded-xl" />;
    }

    if (error) {
        return (
            <Card className="bg-black/50 border-white/10 backdrop-blur-sm shadow-sm hover:border-white/20 transition-colors">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-zinc-400">Submission Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[150px] flex items-center justify-center text-slate-400">
                        Failed to load activity data.
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate date range (last 365 days)
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return (
        <Card className="bg-black/50 border-white/10 backdrop-blur-sm shadow-sm hover:border-white/20 transition-colors col-span-1 md:col-span-3">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-400">Submission Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[600px]">
                        <CalendarHeatmap
                            startDate={oneYearAgo}
                            endDate={today}
                            values={data || []}
                            classForValue={(value) => {
                                if (!value) {
                                    return 'color-empty';
                                }
                                return `color-scale-${Math.min(value.count, 4)}`;
                            }}
                            tooltipDataAttrs={(value: any) => {
                                if (!value || !value.date) {
                                    return { 'data-tooltip-content': 'No submissions' } as any;
                                }
                                return {
                                    'data-tooltip-content': `${value.date}: ${value.count} submission${value.count !== 1 ? 's' : ''}`,
                                    'data-tooltip-id': 'heatmap-tooltip'
                                } as any;
                            }}
                            showWeekdayLabels
                        />
                        <ReactTooltip id="heatmap-tooltip" />
                    </div>
                </div>
                <style jsx global>{`
                    .react-calendar-heatmap text {
                        fill: #94a3b8;
                        font-size: 10px;
                    }
                    .react-calendar-heatmap .color-empty {
                        fill: #1e293b; /* slate-800 */
                    }
                    .react-calendar-heatmap .color-scale-1 { fill: #0e4429; }
                    .react-calendar-heatmap .color-scale-2 { fill: #006d32; }
                    .react-calendar-heatmap .color-scale-3 { fill: #26a641; }
                    .react-calendar-heatmap .color-scale-4 { fill: #39d353; }
                `}</style>
            </CardContent>
        </Card>
    );
}
