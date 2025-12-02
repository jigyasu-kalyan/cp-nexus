'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Terminal } from 'lucide-react';

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
		<div className="flex min-h-screen w-full items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md bg-black/50 border-white/10 backdrop-blur-sm">
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-4">
						<Terminal className="h-10 w-10 text-white" />
					</div>
					<CardTitle className="text-2xl font-bold text-center text-white">Create an account</CardTitle>
					<CardDescription className="text-center text-zinc-400">
						Enter your details to get started
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-zinc-200">Username</FormLabel>
										<FormControl>
											<Input
												placeholder="johndoe"
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
								<p className="text-sm text-red-500 text-center">{error}</p>
							)}
							{success && (
								<p className="text-sm text-green-500 text-center">{success}</p>
							)}

							<Button
								type="submit"
								className="w-full bg-white text-black hover:bg-zinc-200 font-medium"
								disabled={loading}
							>
								{loading ? 'Creating account...' : 'Create Account'}
							</Button>
						</form>
					</Form>
					<div className="text-center text-sm text-zinc-400">
						Already have an account?{' '}
						<Link href="/login" className="font-medium text-white hover:underline">
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
