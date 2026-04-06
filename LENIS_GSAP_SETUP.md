# Lenis & GSAP Animation Integration

Complete smooth scrolling and animation system for Gravix Frontend with Lenis and GSAP integration.

## Installation ✅

Dependencies have been installed:
- `lenis` - Smooth scrolling library
- `gsap` - Professional animation library

```bash
npm install lenis gsap
```

## Features 🚀

### 1. **Smooth Scrolling with Lenis**
- Physics-based smooth scrolling
- Touch & wheel optimization
- Automatically integrated into root layout
- No configuration needed for basic usage

### 2. **GSAP Animations**
- Scroll-triggered animations
- Text animations (typewriter, split text, etc.)
- Parallax effects
- Count-up animations
- Hover animations

### 3. **Pre-built Components**
- `AnimatedElement` - Main animation component
- `ScrollRevealSection` - Reveals animations on scroll
- `ParallaxSection` - Parallax scrolling effect
- `HoverAnimation` - Automatic hover animations
- `ScrollProgressBar` - Progress indicator
- `ScrollIndicator` - Back to top button

### 4. **Advanced Animations**
- Typewriter effect
- Animated counters
- Gradient text animation
- Split text animation
- Blur in effect

## Structure

```
src/
├── hooks/
│   ├── useLenis.tsx                 # Lenis integration hook
│   ├── useGSAPAnimations.ts         # All GSAP animation hooks
│   └── useAnimationOptimizations.ts # Performance optimization hooks
├── components/
│   ├── providers/
│   │   └── LenisProvider.tsx        # Root provider
│   └── animations/
│       ├── AnimatedElement.tsx      # Main animation component
│       ├── ScrollIndicators.tsx     # Progress bar & scroll indicator
│       └── AdvancedAnimations.tsx   # Text & advanced effects
├── lib/
│   ├── animationConfig.ts           # Animation presets
│   └── performanceOptimizations.ts  # Performance utilities
└── app/
    ├── globals.css                  # Animation keyframes
    ├── layout.tsx                   # Root layout with LenisProvider
    └── (public)/
        └── layout.tsx               # Public layout with scroll indicators
```

## Quick Start 🎯

### 1. Basic Animation
```tsx
import { AnimatedElement } from '@/components/animations/AnimatedElement';

export function MyComponent() {
	return (
		<AnimatedElement variant="fadeInUp" delay={0.2}>
			<h1>Hello, animated world!</h1>
		</AnimatedElement>
	);
}
```

### 2. Scroll Reveal
```tsx
import { ScrollRevealSection } from '@/components/animations/AnimatedElement';

export function Features() {
	return (
		<ScrollRevealSection>
			<div data-reveal>Feature 1</div>
			<div data-reveal>Feature 2</div>
			<div data-reveal>Feature 3</div>
		</ScrollRevealSection>
	);
}
```

### 3. Parallax Effect
```tsx
import { ParallaxSection } from '@/components/animations/AnimatedElement';

export function Hero() {
	return (
		<ParallaxSection intensity={0.5}>
			<img src="background.jpg" alt="Hero" />
		</ParallaxSection>
	);
}
```

### 4. Hover Animation
```tsx
import { HoverAnimation } from '@/components/animations/AnimatedElement';

export function Card() {
	return (
		<HoverAnimation>
			<div className="card">Hover me!</div>
		</HoverAnimation>
	);
}
```

### 5. Text Effects
```tsx
import { Typewriter, Counter, GradientText } from '@/components/animations/AdvancedAnimations';

export function TextEffects() {
	return (
		<>
			<h1>
				<Typewriter text="Welcome" speed={50} />
			</h1>
			<p>
				Users: <Counter to={1000} duration={2} />
			</p>
			<h2>
				<GradientText text="Animated" colors={['#3b82f6', '#ec4899']} />
			</h2>
		</>
	);
}
```

## Available Animation Variants

```typescript
// Use with AnimatedElement
variant: 'fadeIn' | 'fadeInUp' | 'slideInLeft' | 'slideInRight'

// Scroll reveal variations use same variants
// Parallax intensity levels
intensity: 0.3 (light) | 0.5 (medium) | 0.8 (heavy)
```

## Animation Hooks

### useGSAPAnimations.ts
- `useGSAPFadeIn(delay?, duration?, easing?)` - Fade in animation
- `useGSAPScrollReveal(options?)` - Scroll reveal with stagger
- `useGSAPParallax(strength?)` - Parallax effect
- `useGSAPCountUp(endValue, options?)` - Number counter
- `useGSAPStagger(delay?, stagger?)` - Stagger multiple elements
- `useGSAPHover()` - Scale on hover
- `useGSAPPin(options?)` - Pin element during scroll
- `useGSAPTextAnimation(text?)` - Character by character reveal
- `useGSAPRefreshTrigger()` - Refresh scroll triggers on resize

### useAnimationOptimizations.ts
- `useReducedMotionPreference()` - Respect motion preferences
- `useLazyAnimation(ref, animationFn)` - Lazy load animations

## Performance Features ⚡

✅ **GPU Acceleration** - All animations use `will-change` & `transform3d`
✅ **Reduced Motion Support** - Respects `prefers-reduced-motion` media query
✅ **Lazy Loading** - Animations trigger only when needed
✅ **Optimized Staggering** - Efficient array animations
✅ **ScrollTrigger Refresh** - Auto-refresh on resize
✅ **Memory Cleanup** - Proper cleanup of observers and timers

## Best Practices 📋

### Do's ✅
- Use `AnimatedElement` for simple animations
- Use `ScrollRevealSection` for content reveals
- Use `ParallaxSection` for backgrounds
- Use `HoverAnimation` for interactive elements
- Set `data-reveal` on children in scroll reveal sections
- Test with motion preferences in DevTools

### Don'ts ❌
- Don't animate layout properties (use transform instead)
- Don't mix Framer Motion with GSAP on same element
- Don't forget `will-change` CSS (already added!)
- Don't ignore `prefers-reduced-motion` preference
- Don't animate too many elements simultaneously

## Browser Support 🌐

- Chrome/Edge 60+
- Firefox 55+
- Safari 13+
- Mobile browsers (iOS Safari 13+, Android Chrome)

## CSS Classes

### Automatic (added by animations)
- `.gpu-accelerated` - GPU acceleration class
- `.ease-gentle` - Smooth timing function
- `.ease-bounce` - Bounce easing
- `.ease-elastic` - Elastic easing

### Animation Keyframes (in globals.css)
- `@keyframes float` - Up-down float effect
- `@keyframes fadeInUp` - Fade + slide up
- `@keyframes fadeInDown` - Fade + slide down
- `@keyframes slideInLeft` - Slide from left
- `@keyframes slideInRight` - Slide from right
- `@keyframes scaleIn` - Scale in effect

## Examples 🎨

### Hero Section with Parallax
```tsx
<section className="hero">
	<ParallaxSection intensity={0.3}>
		<img src="hero-bg.jpg" alt="Background" />
	</ParallaxSection>
	<AnimatedElement variant="fadeInUp" delay={0.2}>
		<h1>Welcome to Gravix</h1>
	</AnimatedElement>
</section>
```

### Feature Cards with Reveal
```tsx
<ScrollRevealSection>
	{features.map((feature, i) => (
		<HoverAnimation key={i}>
			<AnimatedElement variant="fadeInUp" delay={i * 0.1} data-reveal>
				<FeatureCard {...feature} />
			</AnimatedElement>
		</HoverAnimation>
	))}
</ScrollRevealSection>
```

### Statistics Section
```tsx
<section className="stats">
	<AnimatedElement variant="fadeInUp">
		<h2>
			<Counter to={10000} duration={2} prefix="$" />
		</h2>
	</AnimatedElement>
	<AnimatedElement variant="fadeInUp" delay={0.2}>
		<h2>
			<Counter to={500} duration={2} suffix=" users" />
		</h2>
	</AnimatedElement>
</section>
```

## Troubleshooting 🔧

### Animations not showing?
1. Check element has `data-animated` attribute
2. Verify element is in viewport (scroll to see it)
3. Check browser DevTools for errors
4. Ensure Lenis provider is in root layout

### Performance issues?
1. Reduce number of animated elements per section
2. Increase stagger delay between animations
3. Use lighter animations (e.g., opacity only)
4. Check browser Performance tab

### Smooth scrolling not working?
1. Verify `LenisProvider` wraps your app
2. Check for conflicting scroll styles
3. Ensure `scroll-behavior: auto` in CSS (not `smooth`)

## Documentation 📚

See [ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md) for comprehensive examples and patterns.

## License 📄

MIT License - Feel free to use in your projects!

## Support 💬

For issues or questions, check the ANIMATION_GUIDE.md or review component documentation.
