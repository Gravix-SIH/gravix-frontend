import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import React from "react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="max-h-screen background-gradient">
			<Navbar />
			<div className="h-screen overflow-auto">
				{children}
				<Footer />
			</div>
		</div>
	);
}