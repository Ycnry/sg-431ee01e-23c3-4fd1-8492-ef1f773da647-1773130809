"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Calendar, User, LogIn } from "lucide-react";

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Nyumbani", href: "/" },
  { id: "search", icon: Search, label: "Tafuta", href: "/search" },
  { id: "events", icon: Calendar, label: "Matukio", href: "/events" },
  { id: "profile", icon: User, label: "Wasifu", href: "/profile" },
  { id: "login", icon: LogIn, label: "Ingia", href: "/auth/signin" },
];

export function BottomNavigation() {
  const router = useRouter();
  const [hovered, setHovered] = React.useState<number | null>(null);

  const getActiveIndex = (): number => {
    const path = router.pathname;
    
    if (path === "/") return 0;
    if (path.startsWith("/search")) return 1;
    if (path.startsWith("/events")) return 2;
    if (path.startsWith("/profile")) return 3;
    if (path.startsWith("/auth")) return 4;
    
    return 0;
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
      <TooltipProvider delayDuration={100}>
        <nav
          className="relative flex items-center gap-4 sm:gap-6 p-3 rounded-3xl shadow-lg border border-[#1A3C6E]/30"
          style={{ backgroundColor: "#F5A623" }}
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item, i) => {
            const isActive = activeIndex === i;
            const isHovered = hovered === i;
            const showBubble = isActive || isHovered;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <div
                    className="relative flex items-center justify-center"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Morphic glass bubble - shows on hover OR active */}
                    <AnimatePresence>
                      {showBubble && (
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ 
                            scale: isActive ? 1.3 : 1.4, 
                            opacity: 1 
                          }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          }}
                          className="absolute inset-0 rounded-full -z-10 backdrop-blur-2xl shadow-md"
                          style={{
                            background: isActive 
                              ? "linear-gradient(to top right, #1A3C6E, #1A3C6ECC, #1A3C6E99)"
                              : "linear-gradient(to top right, #1A3C6E, #1A3C6E99, transparent)"
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon button with Link */}
                    <Link href={item.href} passHref legacyBehavior>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "relative z-10 rounded-full transition-transform text-white hover:text-white hover:bg-transparent",
                          isActive && "scale-110",
                          !isActive && "hover:scale-110"
                        )}
                        aria-current={isActive ? "page" : undefined}
                        asChild
                      >
                        <a>
                          <item.icon className="h-6 w-6 text-white" />
                          <span className="sr-only">{item.label}</span>
                        </a>
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="text-xs bg-[#1A3C6E] text-white border-[#1A3C6E]"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </div>
  );
}