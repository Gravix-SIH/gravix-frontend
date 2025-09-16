"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const LoginPage: FC = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<Card className="w-full max-w-md p-8 space-y-6">
				<h1 className="te2xt-2xl font-bold text-center">Login</h1>
				{error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
					<p className="mt-2 text-center text-sm text-gray-600">
						Create an account?{" "}
						<Link href="/register" className="text-indigo-600 hover:underline">
							Register
						</Link>
					</p>
					<Button
						variant="default"
						className="w-full"
						onClick={() => { }}
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</Button>
				</div>
				<p className="text-center text-sm text-gray-500">
					Or continue as <Button variant="outline" onClick={() => router.push("/anon")} className="space-x-2">Anonymous</Button>
				</p>
			</Card>
		</div>
	);
};

export default LoginPage;
