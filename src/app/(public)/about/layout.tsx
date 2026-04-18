import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ScrollProgressBar, ScrollIndicator } from "@/components/animations/ScrollIndicators";
import React from "react";
import { Metadata } from "next";

export const metadata : Metadata = {
	title: "About Us - MindCare",
	description: "Learn more about MindCare, our mission, and the team behind the platform. We are dedicated to providing accessible mental health resources and support for students, counsellors, and administrators.",
};

export default function AboutLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen background-gradient flex flex-col">
			<ScrollProgressBar className="bg-gradient-to-r from-primary via-accent to-secondary" />
			<Navbar />
			<main className="flex-1 overflow-hidden w-full">
				{children}
				<Footer />
			</main>
			<ScrollIndicator show={true} />
		</div>
	);
}