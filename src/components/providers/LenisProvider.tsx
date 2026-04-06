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
	if (enableSmoothScroll) {
		useLenis({
			lerp: 0.1,
			duration: 1.2,
			smooth: true,
			smoothTouch: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
		});
	}

	// Refresh GSAP ScrollTrigger on resize for responsive animations
	if (enableAnimations) {
		useGSAPRefreshTrigger();
		useReducedMotionPreference(); // Respect user motion preferences
	}

	return <>{children}</>;
}
