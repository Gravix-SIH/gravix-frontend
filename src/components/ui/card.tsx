import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card"
			className={cn(
				// Ultra 3D claymorphism with embossed effect
				"bg-gradient-to-br from-card to-card/98",
				// Beveled border for 3D depth
				"border-t border-l border-white/60 border-b border-r border-border/40",
				// Ultra 3D shadow system with embossed highlights
				"shadow-[0_12px_32px_rgba(45,37,31,0.14),0_6px_12px_rgba(45,37,31,0.1),0_0_3px_rgba(230,122,77,0.1),inset_0_3px_6px_rgba(255,255,255,0.8),inset_0_-3px_6px_rgba(45,37,31,0.04)]",
				// Enhanced rounded corners for clay feel
				"flex flex-col gap-6 rounded-[2rem] py-6",
				// 3D light effect
				"relative overflow-hidden",
				// Top highlight for sculpted clay effect
				"before:absolute before:inset-0 before:rounded-[2rem] before:bg-gradient-to-b before:from-white/50 before:via-white/15 before:to-transparent before:pointer-events-none before:z-0",
				// 3D depth gradient
				"after:absolute after:inset-0 after:rounded-[2rem] after:bg-gradient-to-br after:from-white/20 after:via-transparent after:to-black/[0.03] after:pointer-events-none after:z-0",
				"[&>*]:relative [&>*]:z-10",
				// Interactive 3D hover
				"transition-all duration-300 hover:shadow-[0_16px_40px_rgba(45,37,31,0.16),0_8px_16px_rgba(45,37,31,0.12),inset_0_4px_8px_rgba(255,255,255,0.85),inset_0_-4px_8px_rgba(45,37,31,0.05)] hover:-translate-y-1",
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
				// Clay separator effect
				"[.border-b]:pb-6 [.border-b]:border-border/40",
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
				"leading-none font-semibold text-card-foreground",
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
				"text-text-secondary text-sm leading-relaxed",
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
			className={cn("px-6 text-card-foreground", className)}
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
				// Clay separator effect
				"[.border-t]:pt-6 [.border-t]:border-border/40",
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