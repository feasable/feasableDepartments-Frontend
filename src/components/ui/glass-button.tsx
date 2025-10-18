import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tight",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, asChild = false, ...props }, ref) => {
    const handleWrapperClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      // If user clicks wrapper padding, forward the click to the inner actionable element
      const target = e.currentTarget.querySelector('a,button') as HTMLElement | null
      if (target && e.target === e.currentTarget) {
        target.click()
      }
    }
    return (
      <div className={cn("glass-button-wrap cursor-pointer rounded-full", className)} onClick={handleWrapperClick}>
        {asChild ? (
          <Slot className={cn("glass-button", glassButtonVariants({ size }))} {...(props as any)}>
            <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>{children}</span>
          </Slot>
        ) : (
          <button className={cn("glass-button", glassButtonVariants({ size }))} ref={ref} {...props}>
            <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>{children}</span>
          </button>
        )}
        <div className="glass-button-shadow rounded-full" />
      </div>
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
