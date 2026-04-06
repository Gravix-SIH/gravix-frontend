"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
	React.ComponentRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			// Base trigger — claymorphism inset style
			"flex h-11 w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm",
			// Background & border
			"bg-gradient-to-br from-white/80 via-card/90 to-card/95",
			"border-t border-l border-white/40 border-b border-r border-border/30",
			// Shadow — inset/recessed feel
			"shadow-[inset_0_2px_6px_rgba(45,37,31,0.1),inset_0_1px_3px_rgba(45,37,31,0.08),0_1px_2px_rgba(255,255,255,0.6)]",
			// Text
			"text-text-primary font-medium",
			// Placeholder
			"[&_span]:text-text-secondary/70",
			// Hover
			"hover:shadow-[inset_0_3px_8px_rgba(45,37,31,0.13),inset_0_1px_4px_rgba(45,37,31,0.1),0_1px_3px_rgba(255,255,255,0.7),0_0_6px_rgba(230,122,77,0.06)]",
			// Focus
			"focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/40",
			// Disabled
			"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 disabled:border-border/20 disabled:shadow-none",
			// Radix state
			"data-[placeholder]:text-text-secondary/70",
			className
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200 data-[state=open]:rotate-180" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
	React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn("flex cursor-default items-center justify-center py-1", className)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
	React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn("flex cursor-default items-center justify-center py-1", className)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
	React.ComponentRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				"relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-2xl",
				// Background — elevated card
				"bg-card border-t border-l border-white/60 border-b border-r border-border/40",
				// Shadow — elevated
				"shadow-[0_16px_40px_rgba(45,37,31,0.18),0_8px_16px_rgba(45,37,31,0.12),0_0_4px_rgba(230,122,77,0.1),inset_0_2px_4px_rgba(255,255,255,0.8)]",
				// Top highlight
				"before:absolute before:inset-0 before:rounded-[1.5rem] before:bg-gradient-to-b before:from-white/40 before:via-white/15 before:to-transparent before:pointer-events-none",
				// Animation
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				// Slide
				"data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
				position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
				className
			)}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<SelectPrimitive.Viewport
				className={cn(
					"p-1.5",
					position === "popper" &&
						"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
	React.ComponentRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn("px-3 py-2 text-xs font-semibold text-text-secondary", className)}
		{...props}
	/>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
	React.ComponentRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-3 pr-8 text-sm outline-none",
			// Default state
			"text-text-primary",
			// Hover
			"hover:bg-gradient-to-br hover:from-primary/8 hover:to-primary/4",
			// Focus
			"focus:bg-gradient-to-br focus:from-primary/10 focus:to-primary/5",
			// Disabled
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			// Selected/checked
			"data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-primary/12 data-[state=checked]:to-primary/6 data-[state=checked]:text-primary data-[state=checked]:font-semibold",
			className
		)}
		{...props}
	>
		<span className="absolute right-2 flex h-4 w-4 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4 text-primary" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
	React.ComponentRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-border/40", className)}
		{...props}
	/>
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
}
