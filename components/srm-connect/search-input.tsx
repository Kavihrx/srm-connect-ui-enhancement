"use client"

import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Search } from "lucide-react"
import type * as React from "react"

type Props = React.ComponentProps<typeof Input> & {
  id?: string
}

export function SearchInput({ id = "global-search", className, ...props }: Props) {
  return (
    <InputGroup className={className}>
      <Search className="size-4 opacity-60" aria-hidden="true" />
      <Input id={id} type="search" placeholder="Search..." aria-label="Search" className="h-10" {...props} />
      <Kbd>/</Kbd>
    </InputGroup>
  )
}
