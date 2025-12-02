'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
        <Card className='w-full max-w-sm bg-slate-900/50 border-slate-800 backdrop-blur text-slate-100'>
            <CardHeader>
                <CardTitle className='text-2xl text-white'>Login to CP-Nexus</CardTitle>
                <CardDescription className="text-slate-400">Enter your email and password to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='user@example.com'
                                            {...field}
                                            className="bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='********'
                                            {...field}
                                            className="bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {error && (
                            <p className='text-sm font-medium text-red-500'>{error}</p>
                        )}
                        <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white border-none' disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </Form>

                <div className='mt-6 text-sm text-slate-400 text-center'>
                    Don't have an account?{' '}
                    <Link href='/register' className='text-blue-500 hover:text-blue-400 hover:underline'>Sign up</Link>
                </div>
            </CardContent>
        </Card>
    );
}