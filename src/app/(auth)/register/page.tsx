"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

// ✅ Validation schema with zod
const signupSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	role: z.enum(["student", "counsellor"]).refine((val) => !!val, { message: "Role is required" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
	const { loading, signup, checkInitialAuth, user } = useAuth();
	const router = useRouter();
	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "student",
		},
	});

	const getDashboardLink = () => {
		return '/dashboard';
	};

	useEffect(() => {
		if (user) {
			router.replace(getDashboardLink());
			return;
		}
		checkInitialAuth();
	}, [user, checkInitialAuth, router]);

	async function onSubmit(values: SignupFormValues) {
		try {
			await signup(values);
			toast.info(`User registered successfully.`, {
				duration: 3000,
			});
			router.push('/dashboard');
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong.", { duration: 3000 });

		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="absolute inset-0 pointer-events-none">
				<Image alt="BG" src={"/auth-bg.png"} width={1024} height={720} className="h-full w-full object-cover" />
			</div>
			<Card className="w-full max-w-md p-6 sm:p-8 border-black/5 shadow-xl !bg-black/10 space-y-6">
				<h1 className="text-3xl font-bold text-center text-text-secondary">
					Create an Account
				</h1>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-text-primary">Full Name</FormLabel>
									<FormControl>
										<Input placeholder="John Doe" {...field} />
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
									<FormLabel className="text-text-primary">Email</FormLabel>
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
									<FormLabel className="text-text-primary">Password</FormLabel>
									<FormControl>
										<Input placeholder="••••••••" type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between">
									<FormLabel className="text-text-primary">Are you a Counsellor?</FormLabel>
									<FormControl>
										<Switch
											className="w-10 h-6 border border-primary"
											checked={field.value === "counsellor"}
											onCheckedChange={(checked) =>
												field.onChange(checked ? "counsellor" : "student")
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<p className="mt-2 text-center text-sm text-text-primary">
							Already have an account?{" "}
							<Link href="/login" className="text-primary hover:underline">
								Login
							</Link>
						</p>

						<Button type="submit" className="w-full" disabled={loading}>
							{"Sign Up"}
						</Button>
					</form>
				</Form>
			</Card>
		</div>
	);
}
