// Performance optimization utilities for Lenis and GSAP integration

// Debounce for resize/scroll events
export const debounce = (func: Function, wait: number) => {
	let timeout: NodeJS.Timeout;
	return function executedFunction(...args: any[]) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

// Throttle for high-frequency events
export const throttle = (func: Function, limit: number) => {
	let inThrottle: boolean;
	return function (...args: any[]) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
};

// Check if animations should be reduced (prefers-reduced-motion)
export const prefersReducedMotion = () => {
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
