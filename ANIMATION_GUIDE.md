/**
 * Lenis & GSAP Animation Integration Guide
 * 
 * This guide covers all the animation and smooth scrolling features integrated into the Gravix frontend.
 */

// ============================================
// 1. SMOOTH SCROLLING WITH LENIS
// ============================================

/**
 * Lenis provides smooth, physics-based scrolling
 * 
 * Get started:
 * - The LenisProvider is already wrapped around your app in root layout
 * - No additional setup needed!
 * 
 * Programmatic scrolling:
 */

import { useLenisScroll } from '@/hooks/useLenis';

export function MyComponent() {
	const { scrollTo, scrollToTop } = useLenisScroll();

	return (
		<>
			<button onClick={() => scrollTo('#section-id')}>
				Scroll to section
			</button>
			<button onClick={scrollToTop}>
				Back to top
			</button>
		</>
	);
}

// ============================================
// 2. BASIC ANIMATIONS WITH GSAP
// ============================================

/**
 * AnimatedElement: The main component for animations
 * Supports: fadeIn, fadeInUp, slideInLeft, slideInRight
 */

import { AnimatedElement } from '@/components/animations/AnimatedElement';

export function BasicAnimation() {
	return (
		<AnimatedElement 
			variant="fadeInUp" 
			delay={0.2} 
			duration={0.8}
		>
			<p>This element fades in and slides up</p>
		</AnimatedElement>
	);
}

// ============================================
// 3. SCROLL REVEAL ANIMATIONS
// ============================================

/**
 * ScrollRevealSection: Reveals elements when scrolled into view
 * Children are revealed with stagger effect
 */

import { ScrollRevealSection } from '@/components/animations/AnimatedElement';

export function ScrollReveal() {
	return (
		<ScrollRevealSection staggerDelay={0.2}>
			<div data-reveal>Item 1</div>
			<div data-reveal>Item 2</div>
			<div data-reveal>Item 3</div>
		</ScrollRevealSection>
	);
}

// ============================================
// 4. PARALLAX EFFECTS
// ============================================

/**
 * ParallaxSection: Creates parallax scrolling effect
 * intensity: 0.3 (light) to 0.8 (heavy)
 */

import { ParallaxSection } from '@/components/animations/AnimatedElement';

export function ParallaxDemo() {
	return (
		<ParallaxSection intensity={0.5}>
			<img src="background.jpg" alt="Parallax" />
		</ParallaxSection>
	);
}

// ============================================
// 5. HOVER ANIMATIONS
// ============================================

/**
 * HoverAnimation: Automatic hover effects with scale
 */

import { HoverAnimation } from '@/components/animations/AnimatedElement';

export function HoverCard() {
	return (
		<HoverAnimation>
			<div className="card">Hover me!</div>
		</HoverAnimation>
	);
}

// ============================================
// 6. ADVANCED TEXT ANIMATIONS
// ============================================

import { 
	Typewriter, 
	Counter, 
	GradientText, 
	SplitText, 
	BlurIn 
} from '@/components/animations/AdvancedAnimations';

// Typewriter effect
export function TypewriterDemo() {
	return (
		<div>
			<h1>
				<Typewriter 
					text="Welcome to Gravix" 
					speed={50}
					delay={0.5}
				/>
			</h1>
		</div>
	);
}

// Animated counter
export function CounterDemo() {
	return (
		<div className="text-4xl font-bold">
			<Counter 
				to={1000}
				duration={2}
				prefix="$"
				suffix=" users"
			/>
		</div>
	);
}

// Gradient text animation
export function GradientDemo() {
	return (
		<h2 className="text-3xl">
			<GradientText 
				text="Animated Gradient" 
				colors={['#3b82f6', '#8b5cf6', '#ec4899']}
				animationDuration={3}
			/>
		</h2>
	);
}

// Split text character by character
export function SplitTextDemo() {
	return (
		<SplitText 
			text="Split animation"
			stagger={0.05}
		/>
	);
}

// Blur in effect
export function BlurInDemo() {
	return (
		<BlurIn strength={10}>
			<img src="image.jpg" alt="Blur in" />
		</BlurIn>
	);
}

// ============================================
// 7. USING GSAP HOOKS DIRECTLY
// ============================================

import { 
	useGSAPFadeIn, 
	useGSAPParallax, 
	useGSAPHover,
	useGSAPScrollReveal,
	useGSAPCountUp 
} from '@/hooks/useGSAPAnimations';

export function DirectGSAPHooks() {
	const fadeInRef = useGSAPFadeIn(0.5, 0.8);
	const parallaxRef = useGSAPParallax(0.5);
	const hoverRef = useGSAPHover();
	const counterRef = useGSAPCountUp(100);

	return (
		<>
			<div ref={fadeInRef}>Fades in</div>
			<div ref={parallaxRef}>Parallax effect</div>
			<div ref={hoverRef}>Hover to scale</div>
			<div ref={counterRef}>0</div>
		</>
	);
}

// ============================================
// 8. SCROLL INDICATORS
// ============================================

import { ScrollProgressBar, ScrollIndicator } from '@/components/animations/ScrollIndicators';

/**
 * ScrollProgressBar: Shows scroll progress at top
 * ScrollIndicator: Shows button to scroll to top
 * 
 * Already added to public layout!
 */

// ============================================
// 9. PERFORMANCE OPTIMIZATIONS
// ============================================

import { useReducedMotionPreference } from '@/hooks/useAnimationOptimizations';
import { prefersReducedMotion } from '@/lib/performanceOptimizations';

// Respect user motion preferences
export function OptimizedComponent() {
	useReducedMotionPreference();

	// Check for reduced motion
	const shouldReduceMotion = prefersReducedMotion();

	return (
		<div>
			{shouldReduceMotion ? (
				<p>Motion reduced per user preference</p>
			) : (
				<p>Full animations enabled</p>
			)}
		</div>
	);
}

// ============================================
// 10. ANIMATION PRESETS
// ============================================

import { animationPresets, easings, parallaxStrengths } from '@/lib/animationConfig';

/**
 * Use predefined animation presets for consistency
 */

export function UsingPresets() {
	return (
		<div>
			{/* All presets include: opacity, duration, ease, etc. */}
			{/* Available: fadeIn, fadeInUp, slideInLeft, slideInRight, scaleIn, rotate, bounce */}
			{/* Available easings: sharp, smooth, elastic, bounce */}
			{/* Available parallax: light (0.3), medium (0.5), heavy (0.8) */}
		</div>
	);
}

// ============================================
// 11. BEST PRACTICES & TIPS
// ============================================

/**
 * ✅ DO:
 * - Use AnimatedElement for simple animations
 * - Use ScrollRevealSection for revealed-on-scroll effects
 * - Use ParallaxSection for background images
 * - Use HoverAnimation for interactive elements
 * - Set willChange on animated elements (already done!)
 * - Test with prefers-reduced-motion disabled
 * - Use stagger delay for multiple elements
 * 
 * ❌ DON'T:
 * - Animate too many elements at once (performance)
 * - Use heavy filters/blur on scroll (expensive)
 * - Forget to clean up event listeners
 * - Ignore prefers-reduced-motion preference
 * - Mix Framer Motion and GSAP animations
 * - Animate layout properties (use transform instead)
 */

// ============================================
// 12. PERFORMANCE MONITORING
// ============================================

import { measureAnimationPerformance } from '@/lib/performanceOptimizations';

export function MonitorPerformance() {
	const handleAnimation = () => {
		measureAnimationPerformance('my-animation', () => {
			// Your animation code here
		});
	};

	return <button onClick={handleAnimation}>Animate</button>;
}

// ============================================
// 13. SETUP IN YOUR PAGES
// ============================================

/**
 * Example: Full-featured page with all animations
 * 
 * Components to use:
 * - AnimatedElement: Main container, headings, buttons
 * - ScrollRevealSection: For content sections
 * - ParallaxSection: For background images
 * - HoverAnimation: For cards/interactive elements
 * - Advanced animations: For text effects
 * - ScrollProgressBar: For page progress (already in layout)
 * - ScrollIndicator: For scroll-to-top (already in layout)
 */

export function FullFeaturedPage() {
	return (
		<>
			{/* Hero section with parallax */}
			<section>
				<ParallaxSection>
					<img src="hero.jpg" alt="Hero" />
				</ParallaxSection>
				<AnimatedElement variant="fadeInUp">
					<h1>Welcome</h1>
				</AnimatedElement>
			</section>

			{/* Content section with reveal */}
			<ScrollRevealSection>
				<div data-reveal>Feature 1</div>
				<div data-reveal>Feature 2</div>
				<div data-reveal>Feature 3</div>
			</ScrollRevealSection>

			{/* Interactive cards */}
			<section>
				{[1, 2, 3].map((i) => (
					<HoverAnimation key={i}>
						<AnimatedElement variant="fadeInUp" delay={i * 0.1}>
							<div className="card">Card {i}</div>
						</AnimatedElement>
					</HoverAnimation>
				))}
			</section>
		</>
	);
}
