import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				// Premium 3D clay input with inset effect
				"file:text-foreground placeholder:text-text-secondary/70 selection:bg-primary/25 selection:text-text-primary",
				"flex h-12 w-full min-w-0 rounded-2xl px-4 py-3 text-base outline-none transition-all duration-300",

				// 3D Inset claymorphism (recessed into surface)
				"bg-gradient-to-br from-white/80 via-card/90 to-card/95",
				"border-t border-l border-border/30 border-b border-r border-white/40",
				"shadow-[inset_0_3px_8px_rgba(45,37,31,0.12),inset_0_1px_4px_rgba(45,37,31,0.08),0_1px_2px_rgba(255,255,255,0.6)]",
				"hover:shadow-[inset_0_4px_10px_rgba(45,37,31,0.14),inset_0_1px_4px_rgba(45,37,31,0.1),0_1px_3px_rgba(255,255,255,0.7),0_0_8px_rgba(230,122,77,0.08)]",

				// Enhanced focus with raised effect
				"focus:bg-gradient-to-br focus:from-white focus:to-card/98 focus:border-primary/50",
				"focus:shadow-[inset_0_2px_6px_rgba(230,122,77,0.12),inset_0_1px_3px_rgba(45,37,31,0.08),0_0_16px_rgba(230,122,77,0.15),0_4px_12px_rgba(230,122,77,0.1),0_1px_3px_rgba(255,255,255,0.8)]",
				"focus:scale-[1.01]",

				// File input styling
				"file:inline-flex file:h-8 file:border-0 file:bg-gradient-to-br file:from-primary file:to-primary/90 file:rounded-lg file:px-3 file:py-1",
				"file:text-sm file:font-semibold file:text-primary-foreground file:shadow-md file:shadow-primary/30",
				"file:hover:from-primary file:hover:to-primary/85 file:hover:shadow-lg file:transition-all file:cursor-pointer",

				// Disabled states
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				"disabled:bg-muted/50 disabled:border-border/30 disabled:shadow-none",

				// Error states with elegant glow
				"aria-invalid:border-destructive/40 aria-invalid:bg-destructive/5 aria-invalid:shadow-[0_0px_12px_rgba(214,92,92,0.15),inset_0_1px_2px_rgba(255,255,255,0.3)]",
				"aria-invalid:focus:shadow-[0_0px_16px_rgba(214,92,92,0.2),0_6px_16px_rgba(45,37,31,0.12),inset_0_2px_4px_rgba(255,255,255,0.4)]",

				// Text color
				"text-text-primary font-medium",

				className
			)}
			{...props}
		/>
	)
}

export { Input }