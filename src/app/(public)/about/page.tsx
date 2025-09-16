"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeUp = (delay = 0) => ({
	initial: { opacity: 0, y: 40 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.7, delay },
});

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
			{/* Hero */}
			<section className="px-6 py-24 text-center">
				<motion.h1
					{...fadeUp(0.1)}
					className="text-5xl font-extrabold text-gray-900"
				>
					About Us
				</motion.h1>
				<motion.p
					{...fadeUp(0.3)}
					className="mt-4 max-w-2xl mx-auto text-lg text-gray-600"
				>
					We believe digital wellbeing should be smart, accessible, and human-first.
					That’s why we’re building tools to empower people with <strong>clarity</strong>,
					<strong> focus</strong>, and <strong>connection</strong>.
				</motion.p>
			</section>

			{/* Our Story */}
			<section className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-2 items-center">
				<motion.div {...fadeUp(0.1)}>
					<img
						src="https://source.unsplash.com/600x400/?collaboration,team"
						alt="Our team"
						className="rounded-xl shadow-md"
					/>
				</motion.div>
				<motion.div {...fadeUp(0.3)}>
					<h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
					<p className="mt-4 text-gray-600 leading-relaxed">
						Founded by a group of engineers and mental health advocates, we set out
						to create a unified platform. One that integrates AI chat, community forums,
						assessments, and booking—all under a privacy-first philosophy.
					</p>
				</motion.div>
			</section>

			{/* Mission & Values */}
			<section className="bg-white py-20">
				<div className="mx-auto max-w-6xl px-6 text-center">
					<h2 className="text-3xl font-bold text-gray-900">Our Mission & Values</h2>
					<p className="mt-2 text-gray-600">
						The principles that guide our decisions and culture.
					</p>

					<div className="mt-12 grid gap-8 md:grid-cols-3">
						{[
							{
								title: "Innovation",
								desc: "We push the limits of AI to solve real human problems.",
							},
							{
								title: "Privacy",
								desc: "Your data belongs to you. Always encrypted, always secure.",
							},
							{
								title: "Community",
								desc: "We grow together, learning and sharing knowledge openly.",
							},
						].map((value, i) => (
							<motion.div
								key={value.title}
								{...fadeUp(0.2 + i * 0.2)}
							>
								<Card className="hover:shadow-md transition">
									<CardHeader>
										<CardTitle>{value.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-gray-600">{value.desc}</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Team */}
			<section className="mx-auto max-w-6xl px-6 py-20">
				<h2 className="text-3xl font-bold text-center text-gray-900">Meet the Team</h2>
				<div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
					{["Alice Johnson", "Bob Kumar", "Charlie Lin"].map((name, i) => (
						<motion.div
							key={name}
							{...fadeUp(0.3 + i * 0.1)}
							className="rounded-xl bg-white p-6 shadow-md text-center"
						>
							<img
								src={`https://i.pravatar.cc/150?img=${i + 10}`}
								alt={name}
								className="mx-auto h-24 w-24 rounded-full border shadow-sm"
							/>
							<h3 className="mt-4 text-lg font-semibold">{name}</h3>
							<p className="text-sm text-gray-500">Core Team</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* Closing CTA */}
			<section className="bg-indigo-600 py-20 text-white text-center">
				<motion.h3 {...fadeUp(0.1)} className="text-3xl font-semibold">
					Be Part of Our Journey
				</motion.h3>
				<motion.p {...fadeUp(0.2)} className="mt-4 max-w-xl mx-auto text-lg">
					We’re building the next generation of digital wellbeing and productivity
					tools. Join us and help shape the future.
				</motion.p>
				<motion.div {...fadeUp(0.3)} className="mt-8">
					<Link href="/signup">
						<Button
							size="lg"
							className="bg-white text-indigo-600 hover:bg-gray-100"
						>
							Join the Platform
						</Button>
					</Link>
				</motion.div>
			</section>
		</div>
	);
}
