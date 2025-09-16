"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Motion presets for smooth staggering
const fadeUp = (delay = 0) => ({
	initial: { opacity: 0, y: 40 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.7, delay },
});

export default function HomePage() {
	return (
		<div className="min-h-screen background-gradient from-indigo-50 via-white to-indigo-100">
			{/* Hero Section */}
			<section className="relative flex flex-col items-center justify-center px-6 py-24 text-center">
				<motion.h1
					{...fadeUp(0.1)}
					className="text-5xl font-extrabold text-gray-900 sm:text-6xl"
				>
					A Smarter Way to Work & Connect
				</motion.h1>
				<motion.p
					{...fadeUp(0.3)}
					className="mt-6 max-w-2xl text-lg text-gray-600"
				>
					All-in-one platform combining <span className="font-semibold">AI Chat,
						Booking, Assessments, Community Hub, and Digital Wellbeing</span>—built
					for teams and individuals who want more focus, less friction.
				</motion.p>
				<motion.div {...fadeUp(0.5)} className="mt-8 flex space-x-4">
					<Link href="/signup">
						<Button size="lg">Get Started</Button>
					</Link>
					<Link href="/about">
						<Button size="lg" variant="outline">
							Learn More
						</Button>
					</Link>
				</motion.div>
			</section>

			{/* Features Grid */}
			<section className="px-6 py-20">
				<div className="mx-auto max-w-6xl text-center">
					<motion.h2
						{...fadeUp(0.1)}
						className="text-3xl font-bold text-gray-900"
					>
						Everything You Need in One Place
					</motion.h2>
					<motion.p {...fadeUp(0.2)} className="mt-2 text-gray-600">
						Stop juggling tools. Get assessments, communication, and insights in
						a single ecosystem.
					</motion.p>
				</div>

				<div className="mt-12 grid gap-8 md:grid-cols-3">
					{[
						{
							title: "AI Chatbot",
							desc: "Personalized support powered by natural conversations.",
						},
						{
							title: "Seamless Bookings",
							desc: "Book sessions, consultations, or assessments instantly.",
						},
						{
							title: "Assessments",
							desc: "Track your progress with intelligent test reports.",
						},
						{
							title: "Community Hub",
							desc: "Share, discuss, and grow with like-minded peers.",
						},
						{
							title: "Resource Library",
							desc: "Curated knowledge base to guide your journey.",
						},
						{
							title: "Secure by Design",
							desc: "Your data is private, encrypted, and under your control.",
						},
					].map((feature, i) => (
						<motion.div
							key={feature.title}
							{...fadeUp(0.2 + i * 0.1)}
							viewport={{ once: true }}
						>
							<Card className="h-full hover:shadow-lg transition">
								<CardHeader>
									<CardTitle>{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600">{feature.desc}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</section>

			{/* Product Explanation Section */}
			<section className="bg-white px-6 py-20">
				<div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-2 items-center">
					<motion.div {...fadeUp(0.1)}>
						<img
							src="https://source.unsplash.com/600x400/?technology,ai"
							alt="Platform demo"
							className="rounded-xl shadow-md"
						/>
					</motion.div>
					<motion.div {...fadeUp(0.3)}>
						<h2 className="text-3xl font-bold text-gray-900">
							Designed for Productivity & Wellbeing
						</h2>
						<p className="mt-4 text-gray-600 leading-relaxed">
							Unlike fragmented apps, our platform integrates <strong>mental
								health support</strong>, <strong>collaboration tools</strong>, and
							<strong> AI-driven insights</strong> into a smooth experience. It’s
							built to help you focus on what matters while keeping balance.
						</p>
						<ul className="mt-6 space-y-3 text-left">
							<li>✅ AI-powered chatbot for instant support</li>
							<li>✅ Private booking & assessment system</li>
							<li>✅ Knowledge hub for growth & learning</li>
							<li>✅ Scalable dashboard for teams & admins</li>
						</ul>
					</motion.div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="px-6 py-20">
				<div className="mx-auto max-w-6xl text-center">
					<motion.h2
						{...fadeUp(0.1)}
						className="text-3xl font-bold text-gray-900"
					>
						Trusted by Professionals & Teams
					</motion.h2>
					<motion.p {...fadeUp(0.2)} className="mt-2 text-gray-600">
						Hear what our users say.
					</motion.p>
				</div>
				<div className="mt-12 grid gap-8 md:grid-cols-3">
					{[
						{
							quote:
								"The AI chat support changed how my team communicates. It’s like having a 24/7 assistant.",
							name: "Sarah, HR Lead",
						},
						{
							quote:
								"I love how I can book assessments and check reports without leaving the platform.",
							name: "Raj, Student",
						},
						{
							quote:
								"This is the missing piece in digital wellbeing & productivity tools.",
							name: "Mark, Startup Founder",
						},
					].map((t, i) => (
						<motion.div
							key={i}
							{...fadeUp(0.3 + i * 0.1)}
							className="rounded-xl bg-white p-6 shadow-md"
						>
							<p className="italic text-gray-700">“{t.quote}”</p>
							<p className="mt-4 font-semibold text-gray-900">- {t.name}</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative bg-indigo-600 py-20 text-white text-center">
				<motion.h3
					{...fadeUp(0.1)}
					className="text-3xl font-semibold"
				>
					Ready to Elevate Your Experience?
				</motion.h3>
				<motion.p {...fadeUp(0.2)} className="mt-4 text-lg">
					Join thousands of users who trust us for seamless digital well-being
					and collaboration.
				</motion.p>
				<motion.div {...fadeUp(0.3)} className="mt-8">
					<Link href="/signup">
						<Button
							size="lg"
							className="bg-white text-indigo-600 hover:bg-gray-100"
						>
							Get Started Now
						</Button>
					</Link>
				</motion.div>
			</section>
		</div>
	);
}
