"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ 
  children,
  defaultOpen = false 
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger() {
  const { setOpen } = useSidebar()
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => setOpen(true)}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}

interface SidebarProps {
  children: React.ReactNode;
  side?: "left" | "right";
}

export function Sidebar({ children, side = "right" }: SidebarProps) {
  const { open, setOpen } = useSidebar()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={side} className="w-[300px] sm:w-[400px]">
        {children}
      </SheetContent>
    </Sheet>
  )
}