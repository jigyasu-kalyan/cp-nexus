'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import api from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const formSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function RegisterPage() {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [success, setSuccess] = React.useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			username: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const res = await api.post('/auth/register', {
				email: values.email,
				username: values.username,
				password: values.password,
			});

			// Backend returns { userWithoutPassword } currently.
			if (res.status === 201) {
				setSuccess('Registration successful. Redirecting to login...');
				// Small delay to show message; then go to login
				setTimeout(() => {
					router.push('/login');
				}, 800);
			} else {
				setError('Registration failed. Please try again.');
			}
		} catch (e: any) {
			const message = e?.response?.data?.message || 'Registration failed. Please try again.';
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className='w-full max-w-sm bg-slate-900/50 border-slate-800 backdrop-blur text-slate-100'>
			<CardHeader>
				<CardTitle className='text-2xl text-white'>Create an account</CardTitle>
				<CardDescription className="text-slate-400">Start tracking your CP grind with CP-Nexus.</CardDescription>
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
											type='email'
											placeholder='you@example.com'
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
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-slate-300">Username</FormLabel>
									<FormControl>
										<Input
											placeholder='yourusername'
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
											placeholder='Your secure password'
											{...field}
											className="bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-500"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{error ? (
							<p className='text-sm text-red-500'>{error}</p>
						) : null}
						{success ? (
							<p className='text-sm text-green-500'>{success}</p>
						) : null}

						<Button className='w-full bg-blue-600 hover:bg-blue-700 text-white border-none' type='submit' disabled={loading}>
							{loading ? 'Creating account...' : 'Register'}
						</Button>
					</form>
				</Form>

				<div className='mt-6 text-sm text-slate-400 text-center'>
					Already have an account?{' '}
					<Link href='/login' className='text-blue-500 hover:text-blue-400 hover:underline'>Log in</Link>
				</div>
			</CardContent>
		</Card>
	);
}
