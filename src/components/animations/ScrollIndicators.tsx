'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ReactNode } from 'react';

interface ScrollProgressBarProps {
	className?: string;
	colors?: string[];
}

export function ScrollProgressBar({ className = '', colors = ['#E67A4D', '#F0A368', '#C9A881'] }: ScrollProgressBarProps) {
	useEffect(() => {
		const progressBar = document.getElementById('scroll-progress-bar');
		if (!progressBar) return;

		gsap.set(progressBar, { width: '0%' });

		window.addEventListener('scroll', () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollPercent = (scrollTop / docHeight) * 100;

			gsap.to(progressBar, {
				width: `${scrollPercent}%`,
				duration: 0.2,
				ease: 'power1.out',
			});
		});
	}, []);

	const gradientStyle = `linear-gradient(90deg, ${colors.join(', ')})`;

	return (
		<div
			id="scroll-progress-bar"
			className={`fixed top-0 left-0 h-2 z-[9999] rounded-r-full transition-all duration-200 ${className}`}
			style={{
				background: gradientStyle,
				willChange: 'width',
				boxShadow: '0 2px 12px rgba(230, 122, 77, 0.5), 0 0 24px rgba(230, 122, 77, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
			}}
		/>
	);
}

// Smooth scroll indicator
interface ScrollIndicatorProps {
	children?: ReactNode;
	show?: boolean;
}

export function ScrollIndicator({ show = true, children }: ScrollIndicatorProps) {
	useEffect(() => {
		if (!show) return;

		const indicator = document.getElementById('scroll-indicator');
		if (!indicator) return;

		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollPercent = (scrollTop / docHeight) * 100;

			gsap.to(indicator, {
				opacity: scrollPercent > 10 ? 1 : 0,
				duration: 0.5,
				ease: 'power2.out',
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [show]);

	if (!show) return null;

	return (
		<div
			id="scroll-indicator"
			className="fixed bottom-8 right-8 z-50 cursor-pointer opacity-0 transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 active:translate-y-0"
			onClick={() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
		>
			{children || (
				<div className="w-14 h-20 bg-gradient-to-b from-primary via-primary to-primary/95 border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-primary/30 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(230,122,77,0.4),0_4px_12px_rgba(45,37,31,0.15),inset_0_3px_6px_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(45,37,31,0.06)] hover:shadow-[0_12px_32px_rgba(230,122,77,0.5),0_6px_16px_rgba(45,37,31,0.2),inset_0_4px_8px_rgba(255,255,255,0.8)] relative overflow-hidden group">
					{/* Top highlight */}
					<div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none" />
					{/* Animated indicator */}
					<div className="w-2 h-3 bg-white rounded-full animate-bounce relative z-10 shadow-lg shadow-white/50" />
				</div>
			)}
		</div>
	);
}
