'use client';

import React, { ReactNode, forwardRef } from 'react';
import { useGSAPFadeIn, useGSAPParallax, useGSAPHover, useGSAPScrollReveal } from '@/hooks/useGSAPAnimations';

interface AnimatedElementProps {
	children: ReactNode;
	variant?: 'fadeIn' | 'fadeInUp' | 'slideInLeft' | 'slideInRight';
	delay?: number;
	duration?: number;
	className?: string;
	parallax?: boolean;
	parallaxStrength?: number;
	hover?: boolean;
	scrollReveal?: boolean;
	as?: React.ElementType;
	[key: string]: unknown;
}

export const AnimatedElement = forwardRef<HTMLDivElement, AnimatedElementProps>(
	(
		{
			children,
			variant = 'fadeIn',
			delay = 0,
			duration = 0.8,
			className = '',
			parallax = false,
			parallaxStrength = 0.5,
			hover = false,
			scrollReveal = false,
			as: Component = 'div',
			...props
		},
		ref
	) => {
		const fadeInRef = useGSAPFadeIn(delay, duration, 'power2.out');
		const parallaxRef = useGSAPParallax(parallaxStrength);
		const hoverRef = useGSAPHover();
		const scrollRevealRef = useGSAPScrollReveal();

		const refs = [ref, fadeInRef];
		if (parallax) refs.push(parallaxRef);
		if (hover) refs.push(hoverRef);
		if (scrollReveal) refs.push(scrollRevealRef);

		// Use the first ref that's not null
		const mergedRef = refs[0];

		// Only apply initial hide style if animation will actually run
		const initialStyle: React.CSSProperties = {
			opacity: 1,
			transform: 'none',
			willChange: 'transform, opacity',
		};

		return (
			<Component
				ref={mergedRef}
				className={className}
				style={initialStyle}
				{...props}
			>
				{children}
			</Component>
		);
	}
);

AnimatedElement.displayName = 'AnimatedElement';

// Scroll reveal section component
interface ScrollRevealSectionProps {
	children: ReactNode;
	className?: string;
	staggerDelay?: number;
}

export function ScrollRevealSection({ children, className = '', staggerDelay = 0.15 }: ScrollRevealSectionProps) {
	const ref = useGSAPScrollReveal({ stagger: staggerDelay });

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}

// Parallax section component
interface ParallaxSectionProps {
	children: ReactNode;
	className?: string;
	intensity?: number;
}

export function ParallaxSection({ children, className = '', intensity = 0.5 }: ParallaxSectionProps) {
	const ref = useGSAPParallax(intensity);

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}

// Hover animation component
interface HoverAnimationProps {
	children: ReactNode;
	className?: string;
}

export function HoverAnimation({ children, className = '' }: HoverAnimationProps) {
	const ref = useGSAPHover();

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}
