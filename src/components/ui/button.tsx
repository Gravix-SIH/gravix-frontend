import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-white/30 backdrop-blur-md",
	{
		variants: {
			variant: {
				default:
					"bg-white/40 text-white border border-white/30 shadow-lg hover:bg-white/30 hover:border-white/40 active:bg-white/25",
				destructive:
					"bg-red-500/20 text-white border border-red-300/30 shadow-lg hover:bg-red-500/30 hover:border-red-300/40 active:bg-red-500/25 focus-visible:ring-red-300/30",
				outline:
					"bg-white/10 text-white border border-white/20 shadow-lg hover:bg-white/20 hover:border-white/30 active:bg-white/15",
				secondary:
					"bg-gray-500/20 text-white border border-gray-300/30 shadow-lg hover:bg-gray-500/30 hover:border-gray-300/40 active:bg-gray-500/25",
				ghost:
					"text-white hover:bg-white/20 hover:backdrop-blur-md active:bg-white/15",
				link: "text-white underline-offset-4 hover:underline backdrop-blur-none",
			},
			size: {
				default: "h-12 px-6 py-3 has-[>svg]:px-5",
				sm: "h-10 rounded-full gap-1.5 px-4 has-[>svg]:px-3.5",
				lg: "h-14 rounded-full px-8 has-[>svg]:px-6",
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
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }