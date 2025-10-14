"use client"

import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

type Props = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <Empty>
      <EmptyTitle>{title}</EmptyTitle>
      {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      {actionLabel ? (
        <Empty.Action>
          <Button onClick={onAction}>{actionLabel}</Button>
        </Empty.Action>
      ) : null}
    </Empty>
  )
}
