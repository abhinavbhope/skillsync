"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Responsive sidebar sizes
const SIDEBAR_WIDTH_EXPANDED = "16rem";
const SIDEBAR_WIDTH_COLLAPSED = "5rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";

// Save collapse state
const SIDEBAR_COOKIE_NAME = "sidebar_state";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider.");
  return context;
}

//
// PROVIDER
//
const SidebarProvider = React.forwardRef(
   ({ defaultOpen = true, children, className, style, ...props }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    
    // Initialize with false to match server and client
    const [open, setOpen] = React.useState(false); // Changed from dynamic init
    
    const toggleSidebar = () => {
      if (isMobile) {
        setOpenMobile((s) => !s);
      } else {
        const newState = !open;
        setOpen(newState);
        Cookies.set(SIDEBAR_COOKIE_NAME, JSON.stringify(newState));
      }
    };

    const state = open ? "expanded" : "collapsed";

     React.useEffect(() => {
      if (typeof window !== 'undefined') {
        const cookieValue = Cookies.get(SIDEBAR_COOKIE_NAME);
        if (cookieValue) {
          setOpen(JSON.parse(cookieValue));
        } else {
          setOpen(defaultOpen);
        }
      }
    }, [defaultOpen]);
    return (
      <SidebarContext.Provider
        value={{ 
          state, 
          open, 
          setOpen, 
          isMobile, 
          openMobile, 
          setOpenMobile, 
          toggleSidebar 
        }}
      >
        <div
          ref={ref}
          style={{
            "--sidebar-width-expanded": SIDEBAR_WIDTH_EXPANDED,
            "--sidebar-width-collapsed": SIDEBAR_WIDTH_COLLAPSED,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
            ...style,
          }}
          className={cn(
  "flex min-h-screen w-full bg-transparent",
  className
)}


          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

//
// SIDEBAR ROOT
//
const Sidebar = React.forwardRef(({ children, className, ...props }, ref) => {
  const { isMobile, openMobile, setOpenMobile, state, open, toggleSidebar } = useSidebar();

  // MOBILE DRAWER
  if (isMobile) {
    return (
      <>
        {/* Mobile Header Trigger */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-10 w-10 bg-card border border-border hover:bg-accent"
          >
            <PanelLeft className="h-5 w-5 text-foreground" />
          </Button>
        </div>

        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left"
            className="p-0 w-[var(--sidebar-width-mobile)] bg-card border-r border-border"
            showClose={false}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 text-foreground hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Navigation Items */}
              <div className="flex-1 p-2">
                {children}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // DESKTOP SIDEBAR
  return (
    <>
      <div
        ref={ref}
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden md:flex flex-col",
          "transition-all duration-300 ease-in-out bg-card border-r border-border shadow-2xl",
          open 
            ? "w-[var(--sidebar-width-expanded)]" 
            : "w-[var(--sidebar-width-collapsed)]",
          className
        )}
        data-state={state}
        {...props}
      >
        {/* Toggle Button */}
        <div className={cn(
          "flex items-center p-4 border-b border-border transition-all duration-300",
          open ? "justify-between" : "justify-center"
        )}>
          {open && (
            <h2 className="text-lg font-semibold text-foreground truncate">Menu</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "h-8 w-8 text-foreground hover:bg-accent transition-all",
              open ? "" : "mx-auto"
            )}
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-2 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Desktop Toggle Button when collapsed */}
      {!open && !isMobile && (
        <div className="hidden md:fixed md:flex top-4 left-4 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-10 w-10 bg-card backdrop-blur-sm border border-border hover:bg-accent"
          >
            <PanelLeft className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      )}
    </>
  );
});
Sidebar.displayName = "Sidebar";

//
// OPTIMIZED SIDEBAR BUTTON
//
const SidebarButton = React.forwardRef(({ 
  icon, 
  children, 
  href = "#", 
  isActive = false,
  className,
  ...props 
}, ref) => {
  const { state } = useSidebar();

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link href={href} ref={ref} {...props}>
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl mx-1 my-1 cursor-pointer group",
              "transition-all duration-200 border border-transparent",
              "hover:border-primary/30 hover:bg-accent hover:shadow-lg",
              isActive
                ? "bg-accent text-foreground shadow-[0_0_12px_rgba(187,247,255,0.4)] border-primary/50"
                : "text-muted-foreground hover:text-foreground",
              state === "expanded" ? "px-4 py-3" : "px-2 py-3 justify-center",
              className
            )}
          >
            {/* Icon */}
            <span className={cn(
              "flex items-center justify-center transition-colors",
              state === "expanded" ? "text-[18px]" : "text-[20px]",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {icon}
            </span>

            {/* Text - only show when expanded */}
            {state === "expanded" && (
              <span className="text-sm font-medium tracking-wide truncate">
                {children}
              </span>
            )}
          </div>
        </Link>
      </TooltipTrigger>
      
      {/* Tooltip for collapsed state */}
      {state === "collapsed" && (
        <TooltipContent 
          side="right" 
          className="bg-card border border-border text-foreground"
        >
          <p className="text-sm">{children}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
});
SidebarButton.displayName = "SidebarButton";

//
// EXPORT ALL
//
export {
  SidebarProvider,
  Sidebar,
  SidebarButton,
  useSidebar,
};