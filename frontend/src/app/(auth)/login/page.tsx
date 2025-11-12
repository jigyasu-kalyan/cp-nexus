'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
            const result = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
            });
            if (result?.error) {
                setError(result.error);
            }
            else if (result?.ok) {
                router.push('/dashboard');
            }
            setLoading(false);
        } catch (error) {
            console.error(`Login failed: ${error}`);
            setError('An unknown error occured.');
            setLoading(false);
        }
    }

    return (
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle className='text-2xl'>Login to CP-Nexus</CardTitle>
                <CardDescription>Enter your email and password to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder='user@example.com' {...field} />
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder='********' {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {error && (
                            <p className='text-sm font-medium text-destructive'>{error}</p>
                        )}
                        <Button type='submit' className='w-full' disabled={loading}>
                            { loading ? 'Loggin in...' : 'Login' }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}