"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function Enhancements() {
  const { toast } = useToast()

  useEffect(() => {
    // Replace blocking alert() with toast-based notifications
    const originalAlert = window.alert
    window.alert = (message?: any) => {
      const desc = typeof message === "string" ? message : JSON.stringify(message)
      toast({
        title: "Notice",
        description: desc,
      })
    }

    // Global keyboard shortcuts
    const onKeyDown = (e: KeyboardEvent) => {
      // Focus search with "/"
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const activeTag = (document.activeElement?.tagName || "").toLowerCase()
        const isTyping =
          ["input", "textarea"].includes(activeTag) || (document.activeElement as HTMLElement)?.isContentEditable
        if (isTyping) return
        e.preventDefault()
        const search =
          (document.querySelector('input[type="search"]') as HTMLInputElement) ||
          (document.querySelector('input[placeholder*="Search" i]') as HTMLInputElement) ||
          (document.getElementById("global-search") as HTMLInputElement)
        if (search) search.focus()
      }

      // Escape closes an open dialog (best-effort)
      if (e.key === "Escape") {
        const openDialog = document.querySelector('[role="dialog"][data-state="open"]') as HTMLElement | null
        if (openDialog) {
          const closeBtn = openDialog.querySelector("[data-dialog-close]") as HTMLButtonElement | null
          if (closeBtn) closeBtn.click()
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.alert = originalAlert
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [toast])

  return null
}
