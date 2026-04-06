'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

// Smooth text reveal animation
interface TypewriterProps {
	text: string;
	speed?: number;
	delay?: number;
	onComplete?: () => void;
}

export function Typewriter({ text, speed = 50, delay = 0, onComplete }: TypewriterProps) {
	const [displayText, setDisplayText] = useState('');
	const [cursorVisible, setCursorVisible] = useState(true);

	useEffect(() => {
		setCursorVisible(true);
		const timer = setTimeout(() => {
			let index = 0;
			const interval = setInterval(() => {
				setDisplayText(text.substring(0, index + 1));
				index++;
				if (index >= text.length) {
					clearInterval(interval);
					onComplete?.();
				}
			}, speed);

			return () => clearInterval(interval);
		}, delay);

		return () => clearTimeout(timer);
	}, [text, speed, delay, onComplete]);

	useEffect(() => {
		const cursorInterval = setInterval(() => {
			setCursorVisible((prev) => !prev);
		}, 500);

		return () => clearInterval(cursorInterval);
	}, []);

	return (
		<>
			{displayText}
			{cursorVisible && <span className="animate-pulse">|</span>}
		</>
	);
}

// Number counter with GSAP
interface CounterProps {
	from?: number;
	to: number;
	duration?: number;
	delay?: number;
	decimals?: number;
	suffix?: string;
	prefix?: string;
	onComplete?: () => void;
}

export function Counter({ from = 0, to, duration = 2, delay = 0, decimals = 0, suffix = '', prefix = '', onComplete }: CounterProps) {
	const [displayValue, setDisplayValue] = useState(from);

	useEffect(() => {
		const obj = { value: from };

		gsap.to(obj, {
			value: to,
			duration,
			delay,
			ease: 'power2.out',
			onUpdate: () => {
				setDisplayValue(parseFloat(obj.value.toFixed(decimals)));
			},
			onComplete,
		});
	}, [from, to, duration, delay, decimals, onComplete]);

	return (
		<span>
			{prefix}
			{displayValue.toLocaleString()}
			{suffix}
		</span>
	);
}

// Gradient text animation
interface GradientTextProps {
	text: string;
	colors?: string[];
	animationDuration?: number;
	className?: string;
}

export function GradientText({
	text,
	colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
	animationDuration = 3,
	className = '',
}: GradientTextProps) {
	useEffect(() => {
		const element = document.getElementById('gradient-text');
		if (!element) return;

		gsap.to(element, {
			backgroundPosition: '200% center',
			duration: animationDuration,
			repeat: -1,
			ease: 'none',
		});
	}, [animationDuration]);

	const gradientStyle = `linear-gradient(90deg, ${colors.join(', ')})`;

	return (
		<span
			id="gradient-text"
			className={`bg-clip-text text-transparent ${className}`}
			style={{
				backgroundImage: gradientStyle,
				backgroundSize: '200% 100%',
				backgroundPosition: '0% center',
			}}
		>
			{text}
		</span>
	);
}

// Text split animation (char by char)
interface SplitTextProps {
	text: string;
	delay?: number;
	stagger?: number;
	className?: string;
}

export function SplitText({ text, delay = 0, stagger = 0.05, className = '' }: SplitTextProps) {
	useEffect(() => {
		const element = document.getElementById('split-text');
		if (!element) return;

		const chars = element.querySelectorAll('span');

		gsap.from(chars, {
			opacity: 0,
			y: 20,
			rotationZ: -10,
			transformOrigin: '0% 50%',
			delay,
			stagger,
			duration: 0.8,
			ease: 'back.out',
		});
	}, [delay, stagger]);

	return (
		<div id="split-text" className={className}>
			{text.split('').map((char, i) => (
				<span key={i} style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
					{char === ' ' ? '\u00A0' : char}
				</span>
			))}
		</div>
	);
}

// Blur in animation
interface BlurInProps {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	strength?: number;
}

export function BlurIn({ children, delay = 0, duration = 0.6, strength = 10 }: BlurInProps) {
	useEffect(() => {
		const element = document.getElementById('blur-in');
		if (!element) return;

		gsap.from(element, {
			opacity: 0,
			filter: `blur(${strength}px)`,
			delay,
			duration,
			ease: 'power2.out',
		});
	}, [delay, duration, strength]);

	return <div id="blur-in">{children}</div>;
}
