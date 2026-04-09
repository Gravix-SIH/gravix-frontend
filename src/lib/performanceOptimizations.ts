// Performance optimization utilities for Lenis and GSAP integration

// Debounce for resize/scroll events
export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
	let timeout: ReturnType<typeof setTimeout> | undefined;

	return function executedFunction(this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	};
};

// Throttle for high-frequency events
export const throttle = <T extends (...args: any[]) => void>(func: T, limit: number) => {
	let inThrottle = false;

	return function throttled(this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (inThrottle) return;

		func.apply(this, args);
		inThrottle = true;
		setTimeout(() => {
			inThrottle = false;
		}, limit);
	};
};

// Check if animations should be reduced (prefers-reduced-motion)
export const prefersReducedMotion = () => {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Lazy load content based on viewport
export const createIntersectionObserver = (
	callback: (entry: IntersectionObserverEntry) => void,
	options?: IntersectionObserverInit
) => {
	const defaultOptions: IntersectionObserverInit = {
		threshold: 0.1,
		rootMargin: '50px',
		...options,
	};

	return new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				callback(entry);
			}
		});
	}, defaultOptions);
};

// Performance monitoring for animations
export const measureAnimationPerformance = (name: string, callback: () => void) => {
	if (typeof window !== 'undefined' && 'performance' in window) {
		const start = performance.now();
		callback();
		const end = performance.now();
		console.debug(`[Animation Perf] ${name}: ${(end - start).toFixed(2)}ms`);
	} else {
		callback();
	}
};

// GPU optimization - add will-change early, remove after animation
export const enableGPUAcceleration = (element: HTMLElement) => {
	element.style.willChange = 'transform, opacity';
};

export const disableGPUAcceleration = (element: HTMLElement) => {
	element.style.willChange = 'auto';
};
