"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-gradient-to-r from-muted/40 to-muted/30 relative h-4 w-full overflow-hidden rounded-full border-t border-l border-white/40 border-b border-r border-border/30 shadow-[inset_0_2px_6px_rgba(45,37,31,0.12),inset_0_1px_3px_rgba(45,37,31,0.08),0_1px_2px_rgba(255,255,255,0.5)]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-gradient-to-r from-primary via-accent to-primary h-full w-full flex-1 transition-all duration-500 shadow-[0_0_16px_rgba(230,122,77,0.5),inset_0_1px_3px_rgba(255,255,255,0.6)] relative rounded-full"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
