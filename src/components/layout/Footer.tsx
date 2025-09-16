import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import React from 'react'
import { Card } from '../ui/card'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

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
	return (
		<footer className="p-16">
			<Card className="p-6">
				<div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
					<div className="flex md:w-1/2 flex-col justify-between gap-6 lg:items-start">
						{/* Logo */}
						<div className="flex items-center gap-2 lg:justify-start">
							<Link href={logo.url}>
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
								<Button key={idx} className="hover:text-background-dark font-medium">
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

	)
}

export default Footer