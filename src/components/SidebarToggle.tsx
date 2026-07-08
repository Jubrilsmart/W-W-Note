"use client";

import { useSidebar } from "@/components/ui/sidebar";
// Import the split-screen panel icons
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function SidebarToggle() {
  // state is a boolean (true if open, false if closed)
  const { toggleSidebar, open } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 border rounded-md hover:bg-accent"
      aria-label="Toggle Sidebar"
    >
      {/* If open, show the icon with the sidebar highlighted/closing. 
          If closed, show the icon indicating it will expand. */}
      {open ? (
        <PanelLeftClose className="h-5 w-5" />
      ) : (
        <PanelLeftOpen className="h-5 w-5" />
      )}
    </button>
  );
}