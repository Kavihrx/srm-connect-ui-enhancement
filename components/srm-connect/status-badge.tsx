"use client"

import { Badge } from "@/components/ui/badge"

type Props = {
  status: "open" | "closed" | "new" | "joined" | "hot"
  className?: string
}

const MAP: Record<Props["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  open: { variant: "default", label: "Open" },
  closed: { variant: "secondary", label: "Closed" },
  new: { variant: "outline", label: "New" },
  joined: { variant: "default", label: "Joined" },
  hot: { variant: "destructive", label: "Hot" },
}

export function StatusBadge({ status, className }: Props) {
  const cfg = MAP[status]
  return (
    <Badge variant={cfg.variant} className={className}>
      {cfg.label}
    </Badge>
  )
}
