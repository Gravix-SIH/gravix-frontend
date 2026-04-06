"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AnimatedElement, HoverAnimation } from "@/components/animations/AnimatedElement";
import { useGSAPFadeIn, useGSAPScrollReveal, useGSAPParallax } from "@/hooks/useGSAPAnimations";

export default function AboutPage() {
	const team = [
		{
			name: "Utpal",
			image: "/team/utpal.png",
		},
		{
			name: "Hazel",
			image: "/team/hazel.png",
		},
	];

	return (
		<div className="min-h-screen overflow-x-hidden">
			{/* Hero Section */}
			<section className="relative flex flex-col items-center justify-center px-6 py-20 sm:py-24 w-full min-h-screen">
				<AnimatedElement
					as="h1"
					variant="fadeInUp"
					className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary text-center"
				>
					About Us
				</AnimatedElement>
				<AnimatedElement
					as="p"
					variant="fadeInUp"
					delay={0.2}
					className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-text-secondary text-center px-4"
				>
					We believe digital wellbeing should be smart, accessible, and human-first.
					That's why we're building tools to empower people with <strong>clarity</strong>,
					<strong> focus</strong>, and <strong>connection</strong>.
				</AnimatedElement>
			</section>

			{/* Our Story */}
			<section className="mx-auto max-w-6xl px-6 py-12 sm:py-16 grid gap-8 sm:gap-12 md:grid-cols-2 items-center">
				<AnimatedElement
					variant="fadeInUp"
					delay={0.1}
					scrollReveal
					className="relative w-full"
				>
					<Image
						src="/story.jpg"
						alt="Our team"
						width={500}
						height={400}
						className="rounded-xl w-full max-h-56 sm:max-h-72 shadow-md object-cover"
					/>
				</AnimatedElement>
				<AnimatedElement
					variant="fadeInUp"
					delay={0.3}
					scrollReveal
					className="flex flex-col"
				>
					<h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Our Story</h2>
					<p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
						Founded by a group of engineers and mental health advocates, we set out
						to create a unified platform. One that integrates AI chat,
						assessments, and booking—all under a privacy-first philosophy.
					</p>
				</AnimatedElement>
			</section>

			{/* Mission & Values */}
			<section className="py-12 sm:py-20 flex flex-col items-center px-6 lg:px-0 mx-auto max-w-6xl w-full">
				<AnimatedElement
					variant="fadeInUp"
					delay={0.1}
					scrollReveal
					className="w-full"
				>
					<div className="text-center mb-8 sm:mb-12">
						<h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Our Mission & Values</h2>
						<p className="mt-2 text-sm sm:text-base text-text-secondary">
							The principles that guide our decisions and culture.
						</p>
					</div>

					<div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
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
							<HoverAnimation key={value.title}>
								<AnimatedElement
									variant="fadeInUp"
									delay={0.2 + i * 0.1}
									scrollReveal
								>
									<Card className="h-full hover:shadow-lg transition">
										<CardHeader>
											<CardTitle className="text-text-primary text-xl sm:text-2xl font-bold">{value.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-text-secondary text-sm sm:text-base">{value.desc}</p>
										</CardContent>
									</Card>
								</AnimatedElement>
							</HoverAnimation>
						))}
					</div>
				</AnimatedElement>
			</section>

			{/* Team */}
			<section className="mx-auto max-w-6xl w-full px-6 py-12 sm:py-20">
				<AnimatedElement
					as="h2"
					className="text-2xl sm:text-3xl font-bold text-center text-text-primary"
					variant="fadeInUp"
					delay={0.1}
					scrollReveal
				>
					Meet the Team
				</AnimatedElement>
				<div className="mt-8 sm:mt-12 flex flex-wrap gap-6 sm:gap-8 justify-center">
					{team.map((member, i) => (
						<HoverAnimation key={member.name}>
							<AnimatedElement
								variant="fadeInUp"
								delay={0.2 + i * 0.1}
								scrollReveal
								className="rounded-xl bg-white/30 flex min-w-64 sm:min-w-72 flex-col justify-between backdrop-blur-md p-4 sm:p-6 shadow-md text-center h-full min-h-80 sm:min-h-96"
							>
								<Image
									src={member.image}
									alt={member.name}
									width={80}
									height={80}
									className="mx-auto h-40 w-40 sm:h-48 sm:w-48 my-4 sm:my-6 rounded-full border shadow-sm object-cover"
								/>
								<div className="mb-4">
									<h3 className="mt-4 text-xl sm:text-2xl font-bold text-text-primary">{member.name}</h3>
									<p className="text-sm sm:text-base text-text-secondary">Core Team</p>
								</div>
							</AnimatedElement>
						</HoverAnimation>
					))}
				</div>
			</section>

			{/* Closing CTA */}
			<section className="py-16 sm:py-20 text-white text-center">
				<AnimatedElement
					as="h3"
					variant="fadeInUp"
					delay={0.1}
					scrollReveal
					className="text-2xl sm:text-3xl font-semibold"
				>
					Be Part of Our Journey
				</AnimatedElement>
				<AnimatedElement
					variant="fadeInUp"
					delay={0.2}
					scrollReveal
					className="mt-4 max-w-xl mx-auto text-base sm:text-lg px-4"
				>
					We're building the next generation of digital wellbeing and productivity
					tools. Join us and help shape the future.
				</AnimatedElement>
				<AnimatedElement
					variant="fadeInUp"
					delay={0.3}
					scrollReveal
					className="mt-8"
				>
					<Link href="/register">
						<Button
							size="lg"
							className="bg-white text-indigo-600 hover:bg-gray-100"
						>
							Join the Platform
						</Button>
					</Link>
				</AnimatedElement>
			</section>
		</div>
	);
}