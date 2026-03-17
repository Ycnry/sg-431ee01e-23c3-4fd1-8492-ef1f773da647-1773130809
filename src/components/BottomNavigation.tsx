import Link from "next/link";
import { useRouter } from "next/router";
import { Calendar, Home, LogIn, Search, User } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

type TabKey = "home" | "search" | "events" | "profile" | "login";

interface NavTab {
  key: TabKey;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const tabs: NavTab[] = [
  { key: "home", href: "/", icon: Home, label: "Nyumbani" },
  { key: "search", href: "/search", icon: Search, label: "Tafuta" },
  { key: "events", href: "/events", icon: Calendar, label: "Matukio" },
  { key: "profile", href: "/profile", icon: User, label: "Wasifu" },
  { key: "login", href: "/auth/signin", icon: LogIn, label: "Ingia" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function BottomNavigation() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const activeIndex = useMemo(() => {
    return clamp(
      tabs.findIndex((t) => isActivePath(router.pathname, t.href)),
      0,
      tabs.length - 1
    );
  }, [router.pathname]);

  const [prevIndex, setPrevIndex] = useState(activeIndex);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    if (prevIndexRef.current !== activeIndex) {
      setPrevIndex(prevIndexRef.current);
      prevIndexRef.current = activeIndex;
    }
  }, [activeIndex]);

  const ActiveIcon = tabs[activeIndex]?.icon ?? Home;

  const waveLeftPercent = (prevIndex + 0.5) * (100 / tabs.length);
  const waveRightPercent = (activeIndex + 0.5) * (100 / tabs.length);
  const waveTravelDistance = Math.abs(waveRightPercent - waveLeftPercent);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[90] pointer-events-none",
        "pb-[calc(env(safe-area-inset-bottom,0px)+12px)]"
      )}
    >
      <div className="mx-auto max-w-[520px] px-3">
        <div className="relative pointer-events-auto">
          <div
            className={cn(
              "relative w-full rounded-full backdrop-blur-xl",
              "magic-pill-shadow",
              "px-2 py-2",
              "bg-[color:var(--magic-orange)]"
            )}
          >
            <div className="absolute inset-0 rounded-full border border-white/20" aria-hidden="true" />

            <motion.div
              className="absolute left-0 top-0 h-full w-full"
              aria-hidden="true"
              initial={false}
              animate={{ x: `${activeIndex * 20}%` }}
              transition={{
                type: "spring",
                stiffness: 520,
                damping: 44,
                mass: 0.9,
              }}
              style={{ pointerEvents: "none" }}
            >
              <div className="relative h-full w-1/5">
                <motion.div
                  layoutId="magic-active-bubble"
                  className={cn(
                    "absolute left-1/2 -top-5 -translate-x-1/2",
                    "h-12 w-12 rounded-full",
                    "bg-[color:var(--magic-blue)]",
                    "shadow-[0_16px_30px_rgba(26,60,110,0.30)]",
                    "flex items-center justify-center"
                  )}
                  transition={{
                    type: "spring",
                    stiffness: 640,
                    damping: 42,
                    mass: 0.9,
                  }}
                >
                  <ActiveIcon className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-full"
                aria-hidden="true"
                initial={false}
                animate={{}}
                style={{ pointerEvents: "none" }}
              >
                <motion.div
                  key={`${prevIndex}-${activeIndex}`}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2",
                    "h-[62px] w-[120px] rounded-full magic-wave"
                  )}
                  style={{ left: `${waveLeftPercent}%`, marginLeft: "-60px" }}
                  animate={{
                    left: `${waveRightPercent}%`,
                  }}
                  transition={{
                    duration: 0.34,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ opacity: 0.0, scaleX: 0.75, scaleY: 0.9 }}
                    animate={{
                      opacity: [0.0, 0.85, 0.25, 0.0],
                      scaleX: [0.75, 1.05 + waveTravelDistance / 80, 1.45 + waveTravelDistance / 120, 1.6],
                      scaleY: [0.9, 1.1, 1.0, 1.0],
                    }}
                    transition={{
                      duration: 0.34,
                      times: [0, 0.25, 0.7, 1],
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </motion.div>
              </motion.div>
            )}

            <div className="relative grid grid-cols-5 items-end">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const active = index === activeIndex;

                return (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    className={cn(
                      "group relative flex flex-col items-center justify-end",
                      "px-1 pt-6 pb-1 touch-target select-none",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 rounded-2xl"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <div className="relative h-7 w-7">
                      {!active && (
                        <Icon
                          className={cn(
                            "h-7 w-7 transition-colors",
                            "text-white/90 group-hover:text-white"
                          )}
                        />
                      )}
                    </div>

                    <span
                      className={cn(
                        "mt-1 text-[10px] leading-tight font-medium transition-colors",
                        active ? "text-white" : "text-white/90 group-hover:text-white"
                      )}
                    >
                      {tab.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="h-1" />
        </div>
      </div>
    </nav>
  );
}