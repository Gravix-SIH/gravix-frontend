// Animation presets for consistent animations across the app
export const animationPresets = {
	fadeIn: {
		opacity: 1,
		y: 0,
		duration: 0.8,
		ease: 'power2.out',
	},
	fadeInUp: {
		opacity: 1,
		y: 0,
		duration: 0.8,
		ease: 'power2.out',
	},
	fadeInDown: {
		opacity: 1,
		y: 0,
		duration: 0.8,
		ease: 'power2.out',
	},
	slideInLeft: {
		x: 0,
		opacity: 1,
		duration: 0.8,
		ease: 'power3.out',
	},
	slideInRight: {
		x: 0,
		opacity: 1,
		duration: 0.8,
		ease: 'power3.out',
	},
	scaleIn: {
		scale: 1,
		opacity: 1,
		duration: 0.6,
		ease: 'back.out',
	},
	rotate: {
		rotate: 360,
		duration: 1,
		ease: 'power2.inOut',
	},
	bounce: {
		y: 0,
		duration: 0.6,
		ease: 'back.out',
	},
};

export const scrollTriggerDefaults = {
	markers: false,
	toggleActions: 'play none none none',
};

export const parallaxStrengths = {
	light: 0.3,
	medium: 0.5,
	heavy: 0.8,
};

// Easing functions
export const easings = {
	sharp: 'power3.inOut',
	smooth: 'power2.inOut',
	elastic: 'elastic.out(1, 0.5)',
	bounce: 'back.out(1.7)',
};
