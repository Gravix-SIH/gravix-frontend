import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { AssessmentProvider } from "@/contexts/AssessmentContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "MindCare - Your Mental Health Companion",
	description: "MindCare is a comprehensive mental health platform designed to support students, counsellors, and administrators. Our mission is to provide accessible mental health resources, personalized assessments, and effective communication tools to foster a supportive community for mental well-being.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased background-gradient-rev`}>
				<AuthProvider>
					<AssessmentProvider>
						{children}
						<Toaster />
					</AssessmentProvider>
				</AuthProvider>
			</body>
		</html >
	);
}
