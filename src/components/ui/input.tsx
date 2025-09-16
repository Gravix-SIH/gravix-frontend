import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				// Base styles with glassmorphism
				"file:text-foreground placeholder:text-white/60 selection:bg-white/30 selection:text-white",
				"flex h-12 w-full min-w-0 rounded-2xl px-4 py-3 text-base outline-none transition-all duration-300",

				// Glassy morphism background and border
				"bg-white/10 backdrop-blur-xl border border-white/20",
				"shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]",

				// Dark mode glassmorphism
				"dark:bg-white/5 dark:border-white/10 dark:placeholder:text-white/40",
				"dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] dark:hover:shadow-[0_8px_40px_rgba(255,255,255,0.08)]",

				// Focus states with glowing effect
				"focus:bg-white/15 focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.2)]",
				"dark:focus:bg-white/8 dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05),0_8px_40px_rgba(255,255,255,0.1)]",

				// Hover effects
				"hover:bg-white/12 hover:border-white/25 hover:scale-[1.01]",
				"dark:hover:bg-white/6 dark:hover:border-white/15",

				// File input styles
				"file:inline-flex file:h-8 file:border-0 file:bg-white/20 file:backdrop-blur-sm file:rounded-lg file:px-3 file:py-1",
				"file:text-sm file:font-medium file:text-white/90 file:shadow-sm",
				"file:hover:bg-white/30 file:transition-colors file:cursor-pointer",
				"dark:file:bg-white/10 dark:file:text-white/80 dark:file:hover:bg-white/20",

				// Disabled states
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
				"disabled:bg-white/5 disabled:border-white/10 disabled:shadow-none",

				// Error states with red glow
				"aria-invalid:border-red-400/50 aria-invalid:bg-red-500/10 aria-invalid:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
				"dark:aria-invalid:border-red-400/30 dark:aria-invalid:bg-red-500/5 dark:aria-invalid:shadow-[0_0_0_3px_rgba(239,68,68,0.05)]",

				// Text color
				"text-white/90 dark:text-white/80",

				className
			)}
			{...props}
		/>
	)
}

export { Input }