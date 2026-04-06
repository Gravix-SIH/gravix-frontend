'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function useGSAPFadeIn(
	delay?: number,
	duration?: number,
	easing?: string
) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		gsap.to(ref.current, {
			opacity: 1,
			y: 0,
			duration: duration ?? 0.8,
			delay: delay ?? 0,
			ease: easing ?? 'power2.out',
		});
	}, [delay, duration, easing]);

	return ref;
}

export function useGSAPScrollReveal(
	options?: {
		duration?: number;
		distance?: number;
		easing?: string;
		stagger?: number;
		start?: string;
		end?: string;
	}
) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		const items = ref.current.querySelectorAll('[data-reveal]');

		gsap.from(items, {
			scrollTrigger: {
				trigger: ref.current,
				start: options?.start ?? 'top 80%',
				end: options?.end ?? 'top 20%',
				markers: false,
			},
			opacity: 0,
			y: options?.distance ?? 30,
			duration: options?.duration ?? 0.8,
			stagger: options?.stagger ?? 0.15,
			ease: options?.easing ?? 'power2.out',
		});
	}, [options]);

	return ref;
}

export function useGSAPParallax(
	strength?: number
) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		gsap.to(ref.current, {
			y: (i, target) => {
				return gsap.getProperty(target, 'offsetHeight') as number * (strength ?? 0.5);
			},
			scrollTrigger: {
				trigger: ref.current,
				scrub: true,
				markers: false,
			},
			ease: 'none',
		});
	}, [strength]);

	return ref;
}

export function useGSAPCountUp(
	endValue: number,
	options?: {
		duration?: number;
		delay?: number;
		easing?: string;
		decimals?: number;
	}
) {
	const ref = useRef<HTMLDivElement>(null);
	const countRef = useRef({ value: 0 });

	useEffect(() => {
		if (!ref.current) return;

		gsap.to(countRef.current, {
			value: endValue,
			duration: options?.duration ?? 2,
			delay: options?.delay ?? 0,
			ease: options?.easing ?? 'power2.out',
			onUpdate: () => {
				if (ref.current) {
					ref.current.textContent = countRef.current.value.toFixed(options?.decimals ?? 0);
				}
			},
		});
	}, [endValue, options]);

	return ref;
}

export function useGSAPStagger(
	delay?: number,
	stagger?: number
) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		const items = ref.current.querySelectorAll('[data-stagger]');

		gsap.from(items, {
			opacity: 0,
			y: 20,
			duration: 0.8,
			delay: delay ?? 0,
			stagger: stagger ?? 0.1,
			ease: 'power2.out',
		});
	}, [delay, stagger]);

	return ref;
}

export function useGSAPHover() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleMouseEnter = () => {
			gsap.to(element, {
				scale: 1.05,
				duration: 0.3,
				ease: 'power2.out',
			});
		};

		const handleMouseLeave = () => {
			gsap.to(element, {
				scale: 1,
				duration: 0.3,
				ease: 'power2.out',
			});
		};

		element.addEventListener('mouseenter', handleMouseEnter);
		element.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			element.removeEventListener('mouseenter', handleMouseEnter);
			element.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	return ref;
}

export function useGSAPPin(
	options?: {
		duration?: number;
		start?: string;
		end?: string;
	}
) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		ScrollTrigger.create({
			trigger: ref.current,
			pin: ref.current,
			start: options?.start ?? 'top center',
			end: options?.end ?? `+=${options?.duration ?? 500}`,
			scrub: 1,
			markers: false,
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.trigger === ref.current) {
					trigger.kill();
				}
			});
		};
	}, [options]);

	return ref;
}

export function useGSAPTextAnimation(
	text?: string
) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current || !text) return;

		// Split text into characters
		ref.current.innerHTML = text
			.split('')
			.map((char) => `<span class="inline-block" style="opacity: 0; will-change: transform;">${char === ' ' ? '&nbsp;' : char}</span>`)
			.join('');

		const chars = ref.current.querySelectorAll('span');

		gsap.to(chars, {
			opacity: 1,
			y: 0,
			duration: 0.6,
			stagger: 0.05,
			ease: 'power2.out',
		});
	}, [text]);

	return ref;
}

// Refresh ScrollTrigger on layout changes
export function useGSAPRefreshTrigger() {
	useEffect(() => {
		const handleResize = () => {
			ScrollTrigger.refresh();
		};

		window.addEventListener('resize', handleResize);
		ScrollTrigger.refresh();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
}
