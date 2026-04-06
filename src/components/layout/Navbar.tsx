'use client';

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import gsap from 'gsap'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const Navbar = () => {
	const headerRef = useRef<HTMLHeadElement>(null);
	const navItemsRef = useRef<HTMLDivElement>(null);
	const { user, loading, logout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Animate navbar on mount
		if (headerRef.current) {
			gsap.from(headerRef.current, {
				y: -100,
				opacity: 0,
				duration: 0.8,
				ease: 'power3.out',
			});
		}

		// Stagger nav items
		if (navItemsRef.current) {
			const items = navItemsRef.current.querySelectorAll('a, button');
			gsap.from(items, {
				opacity: 0,
				y: -10,
				duration: 0.6,
				stagger: 0.1,
				delay: 0.3,
				ease: 'power2.out',
			});
		}
	}, []);

	const handleLogout = async () => {
		await logout();
		router.push('/');
	};

	const getDashboardLink = () => {
		if (!user) return '/login';
		return '/dashboard';
	};

	return (
		<header
			ref={headerRef}
			className="h-[7.5vh] flex items-center border-b-2 border-border/40 sticky top-0 left-0 bg-gradient-to-b from-card/95 via-foreground/40 to-foreground/30 backdrop-blur-xl shadow-[0_4px_16px_rgba(45,37,31,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] w-full z-[1000]"
			style={{ willChange: 'transform, opacity' }}
		>
			<div className="container mx-auto flex items-center justify-between py-4 px-6">
				<Link href="/" className="text-2xl font-bold text-text-primary hover:scale-110 transition-transform">
					<Image src="/logo.svg" alt="Logo" width={40} height={40} className="inline mr-2 mb-1" />
					MindCare
				</Link>
				<nav ref={navItemsRef} className="hidden md:flex gap-6 text-base text-secondary">
					<Link
						href="/about"
						className="text-text-primary hover:text-accent transition-colors"
					>
						About
					</Link>
					<Link
						href="/resources"
						className="text-text-primary hover:text-accent transition-colors"
					>
						Resources
					</Link>
				</nav>
				<div className="flex gap-3">
					{loading ? (
						<Button variant="outline" disabled>Loading...</Button>
					) : user ? (
						<>
							<Link href={getDashboardLink()}>
								<Button variant="outline">Dashboard</Button>
							</Link>
							<Button variant="destructive" onClick={handleLogout}>Logout</Button>
						</>
					) : (
						<Link href="/login">
							<Button>Login</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;