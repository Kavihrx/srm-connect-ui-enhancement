"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type * as React from "react"

type Props = React.ComponentProps<typeof Button> & {
  loading?: boolean
  loadingText?: string
}

export function ModernButton({ loading, loadingText = "Working…", className, children, disabled, ...rest }: Props) {
  return (
    <Button
      className={cn(
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className,
      )}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Spinner className="size-4" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </Button>
  )
}
