"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Bot, BriefcaseBusiness, Check, GraduationCap, Heart, HeartPulse, HeartPulseIcon, Layers, Leaf, MessageCircleCode, NotebookText, Shield, ShieldPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Motion presets for smooth staggering
const fadeUp = (delay = 0) => ({
	initial: { opacity: 0, y: 40 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.7, delay },
});

export default function HomePage() {

	const features = [
		{
			icon: <NotebookText color="turquoise" size={30} />,
			heading: "Smart Assessments",
			subheading: "Understand yourself better with AI-powered evaluations.",
			points: [
				"Take personalized mental health assessments",
				"Get instant, detailed analysis of results",
				"Track your progress over time"
			]
		},
		{
			icon: <Bot color="lime" size={30} />,
			heading: "Private AI Chatbot",
			subheading: "A safe space to talk, anytime you need it.",
			points: [
				"24/7 conversational AI for guidance",
				"Anonymous and confidential interactions",
				"Empathetic responses tailored to your mood"
			]
		},
		{
			icon: <ShieldPlus color="purple" size={30} />,
			heading: "One-Click Session Booking",
			subheading: "Connect with professional counselors seamlessly.",
			points: [
				"Book sessions with licensed counselors",
				"View upcoming appointments at a glance",
				"Flexible scheduling for students"
			]
		},
		{
			icon: <Layers color="red" size={30} />,
			heading: "Resource Hub",
			subheading: "Curated tools and content to support your wellbeing.",
			points: [
				"Access articles, videos, and guided exercises",
				"Tailored recommendations based on your needs",
				"Save and revisit your favorite resources"
			]
		},
		{
			icon: <MessageCircleCode color="orange" size={30} />,
			heading: "Community Forum",
			subheading: "Share, support, and grow together in a safe space.",
			points: [
				"Participate in discussions with peers",
				"Anonymous posting options for privacy",
				"Get answers and advice from the community"
			]
		},
	];

	const more = [
		{
			icon: <HeartPulseIcon color="red" size={30} />,
			heading: "Anxiety & Depression",
			subheading: "Evidence-based treatment for anxiety disorders, depression, and mood-related conditions using CBT, DBT, and mindfulness techniques.",
			points: [
				"Generalized Anxiety Disorder",
				"Major Depressive Disorder",
				"Panic Disorder",
				"Social Anxiety Disorder"
			]
		},
		{
			icon: <Users color="lightblue" size={30} />,
			heading: "Relationship Therapy",
			subheading: "Strengthen your relationships through couples counseling, family therapy, and communication skills training.",
			points: [
				"Couples Counseling",
				"Family Therapy",
				"Communication Skills",
				"Conflict Resolution"
			]
		},
		{
			icon: <Shield color="lightgreen" size={30} />,
			heading: "Trauma & PTSD",
			subheading: "Specialized trauma-informed care using EMDR, somatic therapy, and other evidence-based approaches for healing.",
			points: [
				"EMDR Therapy",
				"Somatic Experiencing",
				"Complex PTSD",
				"Childhood Trauma"
			]
		},
		{
			icon: <BriefcaseBusiness color="orange" size={30} />,
			heading: "Work & Career Stress",
			subheading: "Navigate workplace challenges, burnout prevention, and career transitions with specialized occupational therapy.",
			points: [
				"Burnout Recovery",
				"Work-Life Balance",
				"Career Transitions",
				"Workplace Anxiety"
			]
		},
		{
			icon: <GraduationCap color="violet" size={30} />,
			heading: "Student Mental Health",
			subheading: "Specialized support for students dealing with academic pressure, social challenges, and developmental transitions.",
			points: [
				"Academic Stress",
				"Social Anxiety",
				"Study Skills",
				"Test Anxiety"
			]
		},
		{
			icon: <GraduationCap color="lime" size={30} />,
			heading: "Personal Growth",
			subheading: "Develop self-awareness, emotional intelligence, and life skills through personalized growth-focused therapy sessions.",
			points: [
				"Self-Discovery",
				"Emotional Intelligence",
				"Goal Setting",
				"Mindfulness Training"
			]
		}
	]

	return (
		<div className="min-h-screen overflow-auto">

			{/* Hero Section */}
			<section className="relative flex items-center justify-center md:px-16 px-6 py-24 w-full min-h-screen">
				<motion.div className="flex flex-col w-6/12 justify-center pl-24">
					<motion.h1
						{...fadeUp(0.1)}
						className="text-5xl text-text-primary font-extrabold sm:text-6xl"
					>
						Where Students Find
						<span className="text-background-light/80"> Balance & Guidance</span>
					</motion.h1>
					<motion.p
						{...fadeUp(0.3)}
						className="mt-6 max-w-2xl text-lg text-text-accent"
					>
						University life can be overwhelming — but you’re not alone. Get personalized assessments, book sessions with counsellors, and discover resources that help you find balance.
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
				</motion.div>
				<motion.div {...fadeUp(0.7)} className="flex w-6/12 justify-center">
					<div className="p-7 bg-white/25 backdrop-blur-2xl rounded-2xl relative">
						<Card className="absolute p-4 !backdrop-blur-6xl !bg-white/40 top-0 right-0 translate-x-1/2 -translate-y-1/2"><Heart size={34} color="lightcoral" fill="lightcoral" /></Card>
						<Card className="absolute p-4 bottom-0 left-0 !bg-white/40 !backdrop-blur-6xl -translate-x-1/2 translate-y-1/2"><Leaf size={34} color="lightgreen" fill="lightgreen" /></Card>

						<Image alt="Hero" src="/hero-image.png" width={500} height={400} className="rounded-2xl shadow-lg" />
					</div>
				</motion.div>
			</section>

			{/* Features Grid */}
			<section className="px-6 py-20">
				<div className="mx-auto max-w-6xl text-center">
					<motion.h2
						{...fadeUp(0.1)}
						className="text-4xl text-text-primary font-bold sm:text-5xl"
					>
						Comprehensive Mental Health Solutions
					</motion.h2>
					<motion.p {...fadeUp(0.2)} className="mt-2 text-lg text-text-secondary">
						Our integrated approach combines cutting-edge technology with human expertise to deliver personalized mental health care that adapts to your unique needs and lifestyle.
					</motion.p>
				</div>

				<div className="mt-12 flex flex-wrap justify-center gap-8">
					{features.map((feature, i) => (
						<motion.div
							key={feature.heading}
							{...fadeUp(0.2 + i * 0.1)}
							viewport={{ once: true }}
						>
							<Card className="h-full hover:shadow-lg transition max-w-80">
								<CardHeader>
									<Card className="w-fit p-4 mb-3 border border-text-accent shadow text-text-primary">
										{feature.icon}
									</Card>
									<CardTitle className="text-xl sm:text-2xl">{feature.heading}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-text-secondary/90">{feature.subheading}</p>
									<ul className="mt-3">
										{feature.points.map((point, idx) => (
											<li key={idx} className="mt-2 flex w-full items-center gap-2"><Check color="lightgreen" className="size-5 w-1/9" />
												<p>{point}</p>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</section>

			{/* Product Explanation Section */}
			<section className=" px-6 py-20">
				<div className="mx-auto max-w-6xl text-center">
					<motion.h2
						{...fadeUp(0.1)}
						className="text-4xl text-text-primary font-bold sm:text-5xl"
					>
						Specialized Therapy Areas
					</motion.h2>
					<motion.p {...fadeUp(0.2)} className="mt-2 text-lg text-text-secondary">
						Our expert therapists specialize in various mental health conditions and therapeutic approaches, ensuring you receive the most effective treatment for your specific needs.
					</motion.p>
				</div>

				<div className="mt-12 flex flex-wrap justify-center gap-8">
					{more.map((feature, i) => (
						<motion.div
							key={feature.heading}
							{...fadeUp(0.2 + i * 0.1)}
							viewport={{ once: true }}
						>
							<Card className="h-full hover:shadow-lg transition max-w-96">
								<CardHeader className="flex flex-row w-full items-center justify-baseline gap-4">
									<Card className="w-fit p-4 border border-text-accent shadow text-text-primary">
										{feature.icon}
									</Card>
									<CardTitle className="text-xl sm:text-2xl">{feature.heading}</CardTitle>
								</CardHeader>
								<CardContent className="*:space-y-3">
									<p className="text-text-secondary/90">{feature.subheading}</p>
									<ul className="mt-3">
										{feature.points.map((point, idx) => (
											<li key={idx} className="mt-2 flex w-full items-center gap-2"><Check color="lightgreen" className="size-5 w-1/9" />
												<p>{point}</p>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</section>

			{/* Testimonials */}
			{/* <section className="px-6 py-20">
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
							className="rounded-xl p-6 shadow-md"
						>
							<p className="italic text-gray-700">“{t.quote}”</p>
							<p className="mt-4 font-semibold text-gray-900">- {t.name}</p>
						</motion.div>
					))}
				</div>
			</section> */}

			{/* CTA Section */}
			<section className="relative py-20 text-white text-center">
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
							className=" text-indigo-600"
						>
							Get Started Now
						</Button>
					</Link>
				</motion.div>
			</section>
		</div>
	);
}
