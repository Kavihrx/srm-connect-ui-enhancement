"use client"

import type * as React from "react"

type Props = {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, description, actions, className }: Props) {
  return (
    <div
      className={["flex flex-col gap-2 md:flex-row md:items-end md:justify-between", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <h2 className="text-pretty text-xl font-semibold leading-6">{title}</h2>
        {description ? <p className="text-muted-foreground text-sm leading-6">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
