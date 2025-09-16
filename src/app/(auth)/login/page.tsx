"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

const LoginPage: FC = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="absolute w-full h-screen pointer-events-none">
				<Image alt="BG" src={"/auth-bg.png"} width={1024} height={720} className="h-full aspect-video w-full"/>
			</div>
			<Card className="w-full max-w-md p-8 border-black/5 shadow-xl !bg-black/10 space-y-6">
				<h1 className="text-3xl font-bold text-center">Login</h1>
				{error && <p className="text-red-300 text-sm text-center">{error}</p>}
				<div className="space-y-4">
					<div className="space-y-1">
						<Label>Email</Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
						/>
					</div>
					<div className="space-y-1">
						<Label>Password</Label>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
						/>
					</div>
					<p className="mt-2 text-center text-sm text-text-secondary">
						Create an account?{" "}
						<Link href="/register" className="text-background-light hover:underline">
							Register
						</Link>
					</p>
					<Button
						variant="default"
						className="w-full bg-background-light/25 !hover:bg-background-light/10"
						onClick={() => { }}
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</Button>
				</div>
				<p className="text-center text-sm text-text-primary flex justify-center items-center gap-3">
					Or continue as <Button variant="outline" onClick={() => router.push("/anon")}>Anonymous</Button>
				</p>
			</Card>
		</div>
	);
};

export default LoginPage;
