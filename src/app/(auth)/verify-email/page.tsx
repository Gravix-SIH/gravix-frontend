"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { authApi } from "@/services/authApi";
import { useAuth } from "@/hooks/useAuth";

function VerifyEmailContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const { login } = useAuth();

	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [isVerifying, setIsVerifying] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);
	const [isResending, setIsResending] = useState(false);

	// Countdown timer for resend
	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setInterval(() => {
				setResendCooldown((prev) => {
					if (prev <= 1) return 0;
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [resendCooldown]);

	const handleInputChange = (index: number, value: string) => {
		// Only allow digits
		const digit = value.replace(/\D/g, "").slice(-1);
		const newCode = [...code];
		newCode[index] = digit;
		setCode(newCode);

		// Auto-focus next input
		if (digit && index < 5) {
			const nextInput = document.getElementById(`code-${index + 1}`);
			nextInput?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			const prevInput = document.getElementById(`code-${index - 1}`);
			prevInput?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
		const newCode = [...code];
		for (let i = 0; i < pastedData.length; i++) {
			newCode[i] = pastedData[i];
		}
		setCode(newCode);

		// Focus last filled or first empty
		const focusIndex = Math.min(pastedData.length, 5);
		const nextInput = document.getElementById(`code-${focusIndex}`);
		nextInput?.focus();
	};

	const handleVerify = async () => {
		const fullCode = code.join("");
		if (fullCode.length !== 6) {
			toast.error("Please enter all 6 digits");
			return;
		}

		if (!email) {
			toast.error("Email is missing. Please register again.");
			router.push("/register");
			return;
		}

		setIsVerifying(true);
		try {
			const response = await authApi.verifyEmail(email, fullCode);

			if (response.success) {
				toast.success("Email verified successfully!", { duration: 2000 });

				// Store tokens
				if (response.access && response.refresh) {
					localStorage.setItem("access_token", response.access);
					localStorage.setItem("refresh_token", response.refresh);
				}

				// Login with the created user
				if (response.user) {
					// Redirect to dashboard
					router.push("/dashboard");
				} else {
					router.push("/login");
				}
			} else {
				toast.error(response.error || "Invalid verification code");
			}
		} catch (error) {
			console.error("Verify error:", error);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsVerifying(false);
		}
	};

	const handleResend = async () => {
		if (resendCooldown > 0 || !email) return;

		setIsResending(true);
		try {
			const response = await authApi.resendVerification(email);

			if (response.success) {
				toast.success("New verification code sent!");
				setCode(["", "", "", "", "", ""]);
				setResendCooldown(60);
			} else {
				toast.error(response.error || "Failed to resend code");
			}
		} catch (error) {
			console.error("Resend error:", error);
			toast.error("Failed to resend code. Please try again.");
		} finally {
			setIsResending(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="absolute inset-0 pointer-events-none">
				<Image
					alt="BG"
					src={"/auth-bg.png"}
					width={1024}
					height={720}
					className="h-full w-full object-cover"
				/>
			</div>
			<Card className="w-full max-w-md p-6 sm:p-8 border-black/5 shadow-xl !bg-black/10 space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold text-text-secondary">Verify Your Email</h1>
					<p className="text-text-secondary/70">
						Enter the 6-digit code sent to
					</p>
					<p className="text-primary font-semibold">{email}</p>
				</div>

				<div className="space-y-4">
					<div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
						{code.map((digit, index) => (
							<Input
								key={index}
								id={`code-${index}`}
								type="text"
								inputMode="numeric"
								maxLength={1}
								value={digit}
								onChange={(e) => handleInputChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold"
							/>
						))}
					</div>

					<Button
						onClick={handleVerify}
						disabled={isVerifying || code.join("").length !== 6}
						className="w-full"
					>
						{isVerifying ? "Verifying..." : "Verify Email"}
					</Button>
				</div>

				<div className="text-center space-y-2">
					{resendCooldown > 0 ? (
						<p className="text-text-secondary/60 text-sm">
							Resend code in {resendCooldown}s
						</p>
					) : (
						<button
							onClick={handleResend}
							disabled={isResending}
							className="text-primary hover:underline text-sm disabled:opacity-50"
						>
							{isResending ? "Sending..." : "Didn't receive code? Resend"}
						</button>
					)}
				</div>

				<p className="text-center text-sm text-text-secondary/70">
					Wrong email?{" "}
					<Link href="/register" className="text-primary hover:underline">
						Register again
					</Link>
				</p>
			</Card>
		</div>
	);
}

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-text-secondary">Loading...</p>
			</div>
		}>
			<VerifyEmailContent />
		</Suspense>
	);
}