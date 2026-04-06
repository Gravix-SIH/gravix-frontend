import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground",
				secondary:
					"border-transparent bg-muted text-muted-foreground",
				destructive:
					"border-transparent bg-destructive text-white",
				outline:
					"border-border bg-background text-text-secondary",

				// Solid semantic variants — warm, accessible
				success:
					"border-transparent bg-emerald-500 text-white",
				warning:
					"border-transparent bg-amber-500 text-white",
				info:
					"border-transparent bg-blue-500 text-white",
				error:
					"border-transparent bg-rose-500 text-white",

				// Soft/light variants — pastel, theme-aware
				"success-soft":
					"border-emerald-200 bg-emerald-50 text-emerald-700",
				"warning-soft":
					"border-amber-200 bg-amber-50 text-amber-700",
				"info-soft":
					"border-blue-200 bg-blue-50 text-blue-700",
				"error-soft":
					"border-rose-200 bg-rose-50 text-rose-700",

				// Severity variants
				minimal:
					"border-emerald-200 bg-emerald-50 text-emerald-700",
				mild:
					"border-yellow-200 bg-yellow-50 text-yellow-700",
				moderate:
					"border-orange-200 bg-orange-50 text-orange-700",
				severe:
					"border-rose-200 bg-rose-50 text-rose-700",
				"moderately-severe":
					"border-orange-300 bg-orange-100 text-orange-800",
				good:
					"border-emerald-200 bg-emerald-50 text-emerald-700",
				fair:
					"border-yellow-200 bg-yellow-50 text-yellow-700",
				poor:
					"border-orange-200 bg-orange-50 text-orange-700",
				"very-poor":
					"border-rose-200 bg-rose-50 text-rose-700",

				// Status variants
				pending:
					"border-amber-200 bg-amber-50 text-amber-700",
				confirmed:
					"border-emerald-200 bg-emerald-50 text-emerald-700",
				cancelled:
					"border-rose-200 bg-rose-50 text-rose-700",
				completed:
					"border-blue-200 bg-blue-50 text-blue-700",

				// Assessment type variants
				phq9:
					"border-red-200 bg-red-50 text-red-700",
				gad7:
					"border-blue-200 bg-blue-50 text-blue-700",
				psqi:
					"border-purple-200 bg-purple-50 text-purple-700",

				soft: "border-transparent bg-purple-100 text-purple-700",

				// Role variants
				student:
					"border-blue-200 bg-blue-50 text-blue-700",
				counsellor:
					"border-purple-200 bg-purple-50 text-purple-700",
				admin:
					"border-rose-200 bg-rose-50 text-rose-700",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
)

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span"

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	)
}

export { Badge, badgeVariants }
