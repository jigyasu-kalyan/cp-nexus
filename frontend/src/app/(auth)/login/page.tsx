'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Terminal } from 'lucide-react';

import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const formSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    password: z.string().min(1, {
        message: 'Password is required.',
    }),
});

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/login', {
                email: values.email,
                password: values.password,
            });

            const { token, user } = response.data;

            if (token && user) {
                // Store token and user data
                setToken(token);
                setUser(user);
                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                setError('Login failed. Please try again.');
                setLoading(false);
            }
        } catch (error: any) {
            console.error('Login failed:', error);
            const message = error?.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(message);
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md bg-black/50 border-white/10 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <Terminal className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-white">Sign in</CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-200">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="m@example.com"
                                                {...field}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-white/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-200">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-white/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <p className="text-sm font-medium text-red-500 text-center">{error}</p>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-zinc-200 font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center text-sm text-zinc-400">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-white hover:underline">
                            Register
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}