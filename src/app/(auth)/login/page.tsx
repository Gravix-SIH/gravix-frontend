"use client";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";


const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
type loginFormValues = z.infer<typeof loginSchema>;
const LoginPage: FC = () => {
	const { login, loginAnonymous, checkInitialAuth, loading } = useAuth();
	const router = useRouter();
	const form = useForm<loginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		checkInitialAuth();
	}, [checkInitialAuth]);

	async function onSubmit(values: loginFormValues) {
		try {
			await login(values);
			toast.info(`Logged in successfully.`, {
				duration: 3000,
			});
			router.push('/dashboard');
		} catch (error: any) {
			console.log(error);
			toast.error("Something went wrong.", { duration: 3000 });
		}
	}

	const handleLoginAnon = async () => {
		try {
			await loginAnonymous();
			toast.info(`Logged in successfully.`, {
				duration: 3000,
			});
			router.push('/dashboard');
		} catch (error: any) {
			console.log(error.message);
			toast.error("Something went wrong.", { duration: 3000 });
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="absolute w-full h-screen pointer-events-none">
				<Image alt="BG" src={"/auth-bg.png"} width={1024} height={720} className="h-full aspect-video w-full" />
			</div>
			<Card className="w-full max-w-md p-8 border-black/5 shadow-xl !bg-black/10 space-y-6">
				<h1 className="text-3xl font-bold text-center">Login</h1>

				<Form {...form}>

					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="you@example.com" type="email" {...field} />
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
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input placeholder="••••••••" type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						
						<p className="mt-2 text-center text-sm text-text-secondary">
							Create an account?{" "}
							<Link href="/register" className="text-background-light hover:underline">
								Register
							</Link>
						</p>
						<Button
							variant="default"
							type="submit"
							className="w-full bg-background-light/25 !hover:bg-background-light/10"
							disabled={loading}
						>
							Login
						</Button>
					</form>
				</Form>
				<p className="text-center text-sm text-text-primary flex justify-center items-center gap-3">
					Or continue as <Button variant="outline" disabled={loading} onClick={handleLoginAnon}>Anonymous</Button>
				</p>
			</Card>
		</div>
	);
};

export default LoginPage;
