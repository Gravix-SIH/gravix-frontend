'use client';

import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { Card } from '../ui/card'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
	{ icon: <Instagram className="size-5" />, href: "#", label: "Instagram" },
	{ icon: <Facebook className="size-5" />, href: "#", label: "Facebook" },
	{ icon: <Twitter className="size-5" />, href: "#", label: "Twitter" },
	{ icon: <Linkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const logo = {
	url: "/",
	src: "/logo.svg",
	alt: "MindCare Logo",
	title: "MindCare",
};
const description =
	"MindCare is a mental health platform dedicated to providing resources, support, and community for individuals seeking to improve their mental well-being.";
const copyright = `© ${new Date().getFullYear()} MindCare. All rights reserved.`;

const Footer = () => {
	const footerRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Animate footer on scroll into view
		if (footerRef.current) {
			gsap.from(footerRef.current, {
				scrollTrigger: {
					trigger: footerRef.current,
					start: 'top 80%',
					toggleActions: 'play none none none',
					markers: false,
				},
				opacity: 0,
				y: 50,
				duration: 0.8,
				ease: 'power2.out',
			});
		}

		// Stagger content items
		if (contentRef.current) {
			const items = contentRef.current.querySelectorAll(':scope > div > *');
			gsap.from(items, {
				scrollTrigger: {
					trigger: footerRef.current,
					start: 'top 80%',
					toggleActions: 'play none none none',
					markers: false,
				},
				opacity: 0,
				y: 30,
				duration: 0.6,
				stagger: 0.1,
				ease: 'power2.out',
			});
		}
	}, []);

	const handleSocialHover = (e: React.MouseEvent<HTMLButtonElement>) => {
		gsap.to(e.currentTarget, {
			scale: 1.2,
			rotation: 5,
			duration: 0.3,
			ease: 'back.out',
		});
	};

	const handleSocialHoverLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
		gsap.to(e.currentTarget, {
			scale: 1,
			rotation: 0,
			duration: 0.3,
			ease: 'back.out',
		});
	};

	return (
		<footer ref={footerRef} className="p-16" style={{ willChange: 'transform, opacity' }}>
			<Card className="p-6 shadow-[0_12px_32px_rgba(45,37,31,0.14),0_6px_12px_rgba(45,37,31,0.1),inset_0_3px_6px_rgba(255,255,255,0.8),inset_0_-3px_6px_rgba(45,37,31,0.04)]">
				<div ref={contentRef} className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
					<div className="flex md:w-1/2 flex-col justify-between gap-6 lg:items-start">
						{/* Logo */}
						<div className="flex items-center gap-2 lg:justify-start">
							<Link href={logo.url} className="hover:scale-110 transition-transform">
								<Image
									src={logo.src}
									alt={logo.alt}
									title={logo.title}
									width={150}
									height={150}
								/>
							</Link>
							<h2 className="text-4xl font-semibold">{logo.title}</h2>
						</div>
						<p className="text-text-secondary max-w-[70%] text-base">
							{description}
						</p>
						<ul className="text-muted-foreground flex items-center space-x-6">
							{socialLinks.map((social, idx) => (
								<Button 
									key={idx} 
									className="hover:text-accent font-medium cursor-pointer transition-all shadow-[0_4px_12px_rgba(45,37,31,0.1),inset_0_2px_4px_rgba(255,255,255,0.6)] hover:shadow-[0_6px_16px_rgba(230,122,77,0.2),inset_0_3px_6px_rgba(255,255,255,0.7)]"
									onMouseEnter={handleSocialHover}
									onMouseLeave={handleSocialHoverLeave}
									style={{ willChange: 'transform' }}
								>
									{social.icon}
								</Button>
							))}
						</ul>
					</div>
				</div>
				<div className="text-text-secondary mt-8 flex flex-col justify-between gap-4 border-t py-4 pt-8 text-sm font-medium md:flex-row md:items-center md:text-left">
					<p className="order-2 lg:order-1">{copyright}</p>
				</div>
			</Card>
		</footer>
	);
};

export default Footer;