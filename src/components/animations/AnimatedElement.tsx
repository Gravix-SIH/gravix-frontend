'use client';

import React, { ReactNode, forwardRef } from 'react';
import {
	useGSAPFadeIn,
	useGSAPParallax,
	useGSAPHover,
	useGSAPScrollReveal,
} from '@/hooks/useGSAPAnimations';

// ✅ Utility: merge multiple refs
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
	return (value: T | null) => {
		refs.forEach((ref) => {
			if (!ref) return;
			if (typeof ref === 'function') ref(value);
			else if ('current' in ref) (ref as React.MutableRefObject<T | null>).current = value;
		});
	};
}

// ✅ Polymorphic props
type AnimatedElementOwnProps = {
	children?: ReactNode;
	variant?: 'fadeIn' | 'fadeInUp' | 'slideInLeft' | 'slideInRight';
	delay?: number;
	duration?: number;
	className?: string;
	parallax?: boolean;
	parallaxStrength?: number;
	hover?: boolean;
	scrollReveal?: boolean;
	as?: React.ElementType;
};

type AnimatedElementProps = AnimatedElementOwnProps &
	Omit<React.HTMLAttributes<HTMLElement>, keyof AnimatedElementOwnProps | 'as'>;

// ✅ Base component (generic)
function AnimatedElementBase(
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
		as,
		...props
	}: AnimatedElementProps,
	ref: React.Ref<HTMLElement>
) {
	const Component = (as || 'div') as React.ElementType;

	// GSAP hooks
	const fadeInRef = useGSAPFadeIn(delay, duration, 'power2.out');
	const parallaxRef = useGSAPParallax(parallaxStrength);
	const hoverRef = useGSAPHover();
	const scrollRevealRef = useGSAPScrollReveal();

	// ✅ Merge all refs correctly
	const mergedRef = mergeRefs<HTMLElement>(
		ref,
		fadeInRef as unknown as React.Ref<HTMLElement>,
		parallax ? (parallaxRef as unknown as React.Ref<HTMLElement>) : undefined,
		hover ? (hoverRef as unknown as React.Ref<HTMLElement>) : undefined,
		scrollReveal ? (scrollRevealRef as unknown as React.Ref<HTMLElement>) : undefined
	);

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

// ✅ forwardRef + generics fix
const ForwardedAnimatedElement = forwardRef<HTMLElement, AnimatedElementProps>(AnimatedElementBase);
ForwardedAnimatedElement.displayName = 'AnimatedElement';

export const AnimatedElement = ForwardedAnimatedElement;

// ==============================
// ✅ Scroll Reveal Section
// ==============================

interface ScrollRevealSectionProps {
	children: ReactNode;
	className?: string;
	staggerDelay?: number;
}

export function ScrollRevealSection({
	children,
	className = '',
	staggerDelay = 0.15,
}: ScrollRevealSectionProps) {
	const ref = useGSAPScrollReveal({ stagger: staggerDelay });

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}

// ==============================
// ✅ Parallax Section
// ==============================

interface ParallaxSectionProps {
	children: ReactNode;
	className?: string;
	intensity?: number;
}

export function ParallaxSection({
	children,
	className = '',
	intensity = 0.5,
}: ParallaxSectionProps) {
	const ref = useGSAPParallax(intensity);

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}

// ==============================
// ✅ Hover Animation Wrapper
// ==============================

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
