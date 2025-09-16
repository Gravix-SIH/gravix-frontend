import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card"
			className={cn(
				// Glassmorphism base styles
				"bg-white/25 backdrop-blur-md border border-white/70",
				// Text and shadow
				"text-white shadow-xl shadow-black/10",
				// Layout and spacing
				"flex flex-col gap-6 rounded-2xl py-6",
				// Subtle inner glow effect
				"before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
				"relative overflow-hidden",
				className
			)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
				// Glass separator effect
				"[.border-b]:pb-6 [.border-b]:border-white/10",
				className
			)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				"leading-none font-semibold text-white/90",
				className
			)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn(
				"text-white/70 text-sm leading-relaxed",
				className
			)}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className
			)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6 text-white/80", className)}
			{...props}
		/>
	)
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"flex items-center px-6",
				// Glass separator effect
				"[.border-t]:pt-6 [.border-t]:border-white/10",
				className
			)}
			{...props}
		/>
	)
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
}