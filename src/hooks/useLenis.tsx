'use client';

import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

interface LenisOptions {
	lerp?: number;
	duration?: number;
	easing?: (t: number) => number;
	direction?: 'vertical' | 'horizontal' | 'both';
	gestureDirection?: 'vertical' | 'horizontal' | 'both';
	smooth?: boolean;
	smoothTouch?: boolean;
	wheelMultiplier?: number;
	touchMultiplier?: number;
	infinite?: boolean;
}

let lenisInstance: Lenis | null = null;
let isLenisRunning = true;

export function getLenisInstance() {
	return lenisInstance;
}

export function getIsLenisRunning() {
	return isLenisRunning;
}

export function useLenis(options?: LenisOptions) {
	const lenisRef = useRef<Lenis | null>(null);

	useEffect(() => {
		// Reuse existing instance on client
		if (lenisInstance) {
			lenisRef.current = lenisInstance;
			return;
		}

		// Defer Lenis creation to after initial render
		// Check isLenisRunning to allow stopping before creation
		if (!isLenisRunning) {
			console.log('Lenis: Skipping creation, isLenisRunning is false');
			return;
		}

		let timeoutId: NodeJS.Timeout;
		let rafId: number;

		function initLenis() {
			const lenis = new Lenis({
				lerp: options?.lerp ?? 0.1,
				duration: options?.duration ?? 1.2,
				easing: options?.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
				direction: options?.direction ?? 'vertical',
				gestureDirection: options?.gestureDirection ?? 'vertical',
				smooth: options?.smooth ?? true,
				smoothTouch: options?.smoothTouch ?? true,
				wheelMultiplier: options?.wheelMultiplier ?? 1,
				touchMultiplier: options?.touchMultiplier ?? 2,
				infinite: options?.infinite ?? false,
			});

			lenisRef.current = lenis;
			lenisInstance = lenis;

			function raf(time: number) {
				if (isLenisRunning && lenisInstance) {
					lenisInstance.raf(time);
				}
				rafId = requestAnimationFrame(raf);
			}

			rafId = requestAnimationFrame(raf);
		}

		timeoutId = setTimeout(initLenis, 100);

		// Cleanup
		return () => {
			clearTimeout(timeoutId);
			cancelAnimationFrame(rafId);
		};
	}, [options]);

	return lenisRef.current;
}

export function stopLenis() {
	isLenisRunning = false;
	if (lenisInstance) {
		lenisInstance.destroy();
		lenisInstance = null;
	}
}

let lenisInitTimeout: NodeJS.Timeout | null = null;

export function startLenis() {
	if (!lenisInstance && isLenisRunning) {
		// Reinitialize Lenis
		const lenis = new Lenis({
			lerp: 0.1,
			duration: 1.2,
			direction: 'vertical',
			gestureDirection: 'vertical',
			smooth: true,
			smoothTouch: false,
			wheelMultiplier: 1,
			touchMultiplier: 2,
		});

		lenisInstance = lenis;

		function raf(time: number) {
			if (isLenisRunning && lenisInstance) {
				lenisInstance.raf(time);
			}
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);
	}
}

export function useLenisScroll() {
	const lenis = useLenis();

	return {
		scrollTo: (target: string | number | HTMLElement, options?: Parameters<Lenis['scrollTo']>[1]) => {
			lenis?.scrollTo(target, options);
		},
		scrollBy: (distance: number, options?: Parameters<Lenis['scrollBy']>[1]) => {
			lenis?.scrollBy(distance, options);
		},
		scrollToTop: () => {
			lenis?.scrollTo(0, { duration: 1.5 });
		},
	};
}
