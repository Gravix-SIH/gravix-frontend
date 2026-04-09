'use client';

import React, { ReactNode } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { useGSAPRefreshTrigger } from '@/hooks/useGSAPAnimations';
import { useReducedMotionPreference } from '@/hooks/useAnimationOptimizations';

interface LenisProviderProps {
	children: ReactNode;
	enableSmoothScroll?: boolean;
	enableAnimations?: boolean;
}

export function LenisProvider({
	children,
	enableSmoothScroll = true,
	enableAnimations = true
}: LenisProviderProps) {
	// Initialize Lenis smooth scrolling with optimized settings
	useLenis({
		lerp: 0.1,
		duration: 1.2,
		smooth: enableSmoothScroll,
		smoothTouch: enableSmoothScroll,
		wheelMultiplier: 1,
		touchMultiplier: 2,
	});

	// Refresh GSAP ScrollTrigger on resize for responsive animations
	useGSAPRefreshTrigger();
	useReducedMotionPreference(); // Respect user motion preferences

	return <>{children}</>;
}
