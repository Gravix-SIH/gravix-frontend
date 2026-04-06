'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/performanceOptimizations';

// Hook to disable animations based on user preferences
export function useReducedMotionPreference() {
	useEffect(() => {
		const prefersReduced = prefersReducedMotion();

		if (prefersReduced) {
			// Disable all GSAP animations if user prefers reduced motion
			gsap.globalTimeline.timeScale(0);
			gsap.set('*', { '--animation-duration': '0.01s' });
		}

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const handleChange = (e: MediaQueryListEvent) => {
			if (e.matches) {
				gsap.globalTimeline.timeScale(0);
			} else {
				gsap.globalTimeline.timeScale(1);
			}
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);
}

// Hook for lazy animation loading
export function useLazyAnimation(ref: React.RefObject<HTMLElement>, animationFn: (el: HTMLElement) => void) {
	useEffect(() => {
		if (!ref.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.target instanceof HTMLElement) {
						animationFn(entry.target);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(ref.current);

		return () => {
			observer.disconnect();
		};
	}, [ref, animationFn]);
}
