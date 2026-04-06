import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background-light relative overflow-hidden group",
	{
		variants: {
			variant: {
				default:
					"bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-t border-l border-white/30 border-b border-r border-primary/20 shadow-[0_6px_16px_rgba(230,122,77,0.35),0_3px_6px_rgba(45,37,31,0.15),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(45,37,31,0.08)] hover:shadow-[0_8px_24px_rgba(230,122,77,0.4),0_4px_8px_rgba(45,37,31,0.2),inset_0_3px_6px_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(45,37,31,0.06)] hover:-translate-y-1.5 hover:scale-[1.02] active:shadow-[inset_0_3px_8px_rgba(45,37,31,0.2),inset_0_1px_4px_rgba(45,37,31,0.15),0_2px_4px_rgba(230,122,77,0.2)] active:translate-y-0 active:scale-100",
				destructive:
					"bg-gradient-to-br from-rose-600 via-rose-500 to-rose-600 text-white border-t border-l border-white/30 shadow-[0_6px_16px_rgba(214,92,92,0.35),inset_0_2px_4px_rgba(255,255,255,0.6)] hover:shadow-[0_8px_24px_rgba(214,92,92,0.4),inset_0_3px_6px_rgba(255,255,255,0.7)] hover:-translate-y-1.5 active:shadow-[inset_0_3px_8px_rgba(45,37,31,0.2)] active:translate-y-0 focus-visible:ring-destructive/50",
				outline:
					"bg-gradient-to-br from-white to-card/95 text-primary border-2 border-primary/60 shadow-[0_4px_12px_rgba(45,37,31,0.1),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:bg-primary/5 hover:shadow-[0_6px_16px_rgba(230,122,77,0.15),inset_0_2px_4px_rgba(255,255,255,0.8)] hover:-translate-y-1 active:shadow-[inset_0_2px_6px_rgba(230,122,77,0.15)] active:translate-y-0",
				secondary:
					"bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 text-amber-800 border-t border-l border-white/60 border-b border-r border-amber-200 shadow-[0_4px_12px_rgba(200,168,129,0.2),inset_0_2px_4px_rgba(255,255,255,0.8)] hover:shadow-[0_6px_16px_rgba(200,168,129,0.25),inset_0_3px_6px_rgba(255,255,255,0.9)] hover:-translate-y-1 active:shadow-[inset_0_2px_6px_rgba(200,168,129,0.15)] active:translate-y-0",
				ghost:
					"text-text-primary hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 active:shadow-[inset_0_2px_4px_rgba(230,122,77,0.15)] hover:shadow-sm",
				link: "text-primary underline-offset-4 hover:underline font-normal",
			},
			size: {
				default: "h-12 px-6 py-3 has-[>svg]:px-5",
				sm: "h-10 rounded-full gap-1.5 px-4 has-[>svg]:px-3.5",
				lg: "h-14 rounded-full px-8 has-[>svg]:px-6 text-base",
				icon: "size-12",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }), className, "hover:translate-0")}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
