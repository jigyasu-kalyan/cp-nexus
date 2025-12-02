'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { mutate } from 'swr';
import { Link as LinkIcon } from 'lucide-react';

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
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="p-3 bg-white/5 rounded-full border border-white/10">
                    <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Successfully Linked!</h3>
                <p className="text-sm text-zinc-400">
                    Your Codeforces account has been connected. Data sync is in progress.
                </p>
            </div>
        );
    }

    return (
        <Card className="bg-black/50 border-white/10 backdrop-blur-sm shadow-sm hover:border-white/20 transition-colors">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-400">Connect Codeforces</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleConnect} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cf-handle" className="text-zinc-400">Handle</Label>
                        <Input
                            id="cf-handle"
                            placeholder="e.g. tourist"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            disabled={isLoading}
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-white/20"
                        />
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-medium" disabled={isLoading || !handle}>
                        {isLoading ? 'Connecting...' : 'Connect'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
