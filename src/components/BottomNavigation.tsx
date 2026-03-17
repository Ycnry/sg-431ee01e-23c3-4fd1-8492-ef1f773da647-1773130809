import Link from "next/link";
import { useRouter } from "next/router";
import { Calendar, Home, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  { key: "login", href: "/auth/signin", icon: User, label: "Ingia" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BottomNavigation() {
  const router = useRouter();
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => isActivePath(router.pathname, t.href))
  );

  const ActiveIcon = tabs[activeIndex]?.icon ?? Home;

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[80] pointer-events-none",
        "pb-[calc(env(safe-area-inset-bottom,0px)+12px)]"
      )}
    >
      <div className="mx-auto max-w-[520px] px-3">
        <div className="relative pointer-events-auto">
          <div
            className={cn(
              "relative w-full rounded-full bg-white/95 backdrop-blur-xl",
              "border border-black/5 magic-pill-shadow",
              "px-2 py-2"
            )}
          >
            <div className="grid grid-cols-5 items-end">
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
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--magic-blue)] rounded-2xl"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <div className="relative h-7 w-7">
                      {!active && (
                        <Icon
                          className={cn(
                            "h-7 w-7 text-zinc-400 transition-colors",
                            "group-hover:text-zinc-600"
                          )}
                        />
                      )}
                    </div>

                    <span
                      className={cn(
                        "mt-1 text-[10px] leading-tight font-medium transition-colors",
                        active ? "text-[color:var(--magic-blue)]" : "text-zinc-500 group-hover:text-zinc-700"
                      )}
                    >
                      {tab.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <motion.div
              className="absolute left-0 top-0 h-full w-full"
              aria-hidden="true"
              initial={false}
              animate={{ x: `${activeIndex * 20}%` }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              style={{ pointerEvents: "none" }}
            >
              <div className="relative h-full w-1/5">
                <motion.div
                  layoutId="magic-active-bubble"
                  className={cn(
                    "absolute left-1/2 -top-5 -translate-x-1/2",
                    "h-12 w-12 rounded-full",
                    "bg-[color:var(--magic-blue)]",
                    "shadow-[0_14px_28px_rgba(26,60,110,0.25)]",
                    "flex items-center justify-center"
                  )}
                  transition={{ type: "spring", stiffness: 600, damping: 40 }}
                >
                  <ActiveIcon className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="h-1" />
        </div>
      </div>
    </nav>
  );
}