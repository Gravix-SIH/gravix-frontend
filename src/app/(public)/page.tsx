"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Bot, BriefcaseBusiness, Check, GraduationCap, Heart, HeartPulseIcon, Layers, Leaf, MessageCircleCode, NotebookText, Shield, ShieldPlus, Users } from "lucide-react";
import { AnimatedElement, ScrollRevealSection, ParallaxSection, HoverAnimation } from "@/components/animations/AnimatedElement";
import { useGSAPFadeIn, useGSAPScrollReveal, useGSAPParallax } from "@/hooks/useGSAPAnimations";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
	const { user, loading } = useAuth();
	const router = useRouter();

	const getDashboardLink = () => {
		return '/dashboard';
	};

	const handleGetStarted = () => {
		if (user) {
			router.push(getDashboardLink());
		} else {
			router.push('/register');
		}
	};

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
			icon: <Users color="turquoise" size={30} />,
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
		<div className="min-h-screen overflow-x-hidden">

			{/* Hero Section */}
			<section className="relative flex flex-col-reverse md:flex-row items-center justify-center md:px-16 px-6 py-16 sm:py-24 w-full min-h-[100vh]">
				<div className="flex flex-col md:w-6/12 justify-center pt-12 md:pt-0 md:pl-16 lg:pl-24">
					<h1
						className="text-4xl sm:text-5xl md:text-6xl text-text-primary font-extrabold"
					>
						Where Students Find
						<span className="text-background-light/80"> Balance & Guidance</span>
					</h1>
					<p
						className="mt-6 max-w-2xl text-lg text-text-accent"
					>
						University life can be overwhelming — but you’re not alone. Get personalized assessments, book sessions with counsellors, and discover resources that help you find balance.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
						<Button size="lg" onClick={handleGetStarted}>Get Started</Button>
						<Button size="lg" variant="outline" onClick={() => {
							const featuresSection = document.getElementById("features");
							if (featuresSection) {
								featuresSection.scrollIntoView({ behavior: "smooth" });
							}
						}}>
							Learn More
						</Button>
					</div>
				</div>
				<div className="flex w-full md:w-6/12 justify-center mt-8 md:mt-0">
					<div className="relative">
						<Card className="absolute z-10 p-3 sm:p-4 !backdrop-blur-6xl !bg-white/40 top-0 right-0 translate-x-1/2 -translate-y-1/2"><Heart size={28} color="lightcoral" fill="lightcoral" /></Card>
						<Card className="absolute z-10 p-3 sm:p-4 bottom-0 left-0 !bg-white/40 !backdrop-blur-6xl -translate-x-1/2 translate-y-1/2"><Leaf size={28} color="lightgreen" fill="lightgreen" /></Card>
						<div className="p-5 sm:p-7 bg-white/25 backdrop-blur-2xl rounded-2xl animate-float">
							<Image alt="Hero" src="/hero-image.png" width={400} height={320} className="rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg" />
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section id="features" className="px-6 py-20">
				<ScrollRevealSection className="mx-auto max-w-6xl text-center">
					<AnimatedElement as="h2" className="text-4xl text-text-primary font-bold sm:text-5xl" data-reveal variant="fadeInUp">
						Comprehensive Mental Health Solutions
					</AnimatedElement>
					<AnimatedElement as="p" className="mt-2 text-lg text-text-secondary" data-reveal variant="fadeInUp">
						Our integrated approach combines cutting-edge technology with human expertise to deliver personalized mental health care that adapts to your unique needs and lifestyle.
					</AnimatedElement>
				</ScrollRevealSection>

				<div className="mt-12 flex flex-wrap justify-center gap-8">
					{features.map((feature, i) => (
						<HoverAnimation key={feature.heading}>
							<AnimatedElement
								className="h-full"
								variant="fadeInUp"
								delay={i * 0.1}
								duration={0.8}
								scrollReveal
							>
								<Card className="h-full hover:shadow-lg transition max-w-80 ">
									<CardHeader>
										<Card className="w-fit p-4 border border-text-accent shadow text-text-primary">
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
							</AnimatedElement>
						</HoverAnimation>
					))}
				</div>
			</section>

			{/* Product Explanation Section */}
			<section className=" px-6 py-20">
				<ScrollRevealSection className="mx-auto max-w-6xl text-center">
					<AnimatedElement as="h2" className="text-4xl text-text-primary font-bold sm:text-5xl" data-reveal variant="fadeInUp">
						Specialized Therapy Areas
					</AnimatedElement>
					<AnimatedElement as="p" className="mt-2 text-lg text-text-secondary" data-reveal variant="fadeInUp">
						Our expert therapists specialize in various mental health conditions and therapeutic approaches, ensuring you receive the most effective treatment for your specific needs.
					</AnimatedElement>
				</ScrollRevealSection>

				<div className="mt-12 flex flex-wrap justify-center gap-8">
					{more.map((feature, i) => (
						<HoverAnimation key={feature.heading}>
							<AnimatedElement
								className="h-full"
								variant="fadeInUp"
								delay={i * 0.15}
								duration={0.8}
								scrollReveal
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
							</AnimatedElement>
						</HoverAnimation>
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
					<motion.p {...fadeUp(0.2)} className="mt-2 text-text-secondary">
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
				<AnimatedElement as="h3" className="text-3xl font-semibold" variant="fadeInUp" delay={0.1}>
					Ready to Elevate Your Experience?
				</AnimatedElement>
				<AnimatedElement as="p" className="mt-4 text-lg" variant="fadeInUp" delay={0.2}>
					Join thousands of users who trust us for seamless digital well-being
					and collaboration.
				</AnimatedElement>
				<AnimatedElement as="div" className="mt-8" variant="fadeInUp" delay={0.3}>
					<Button size="lg" onClick={handleGetStarted}>
						Get Started Now
					</Button>
				</AnimatedElement>
			</section>
		</div>
	);
}
