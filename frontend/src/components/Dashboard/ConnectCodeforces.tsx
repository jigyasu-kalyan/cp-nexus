'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { mutate } from 'swr';

export function ConnectCodeforces() {
    const [handle, setHandle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!handle.trim()) return;

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.post('/profiles/link', {
                platform: 'CODEFORCES',
                handle: handle.trim(),
            });
            setSuccess(true);
            setHandle('');
            // Refresh dashboard data
            mutate('dashboard/stats');
        } catch (err: any) {
            console.error('Failed to link Codeforces:', err);
            setError(err.response?.data?.message || 'Failed to link account. Please check the handle.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">Successfully Linked!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-green-600 dark:text-green-300">
                        Your Codeforces account has been connected. Data sync is in progress.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-200">Connect Codeforces</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleConnect} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cf-handle" className="text-slate-300">Handle</Label>
                        <Input
                            id="cf-handle"
                            placeholder="e.g. tourist"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            disabled={isLoading}
                            className="bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-500"
                        />
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none" disabled={isLoading || !handle}>
                        {isLoading ? 'Connecting...' : 'Connect'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
