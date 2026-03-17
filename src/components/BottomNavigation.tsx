import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type TabKey = "home" | "search" | "events" | "profile" | "login";

interface NavTab {
  key: TabKey;
  href: string;
  icon: string;
  labelKey: string;
}

const tabs: NavTab[] = [
  { key: "home", href: "/", icon: "home-outline", labelKey: "nav.tab.home" },
  { key: "search", href: "/search", icon: "search-outline", labelKey: "nav.tab.search" },
  { key: "events", href: "/events", icon: "calendar-outline", labelKey: "nav.tab.events" },
  { key: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
  { key: "login", href: "/auth/signin", icon: "log-in-outline", labelKey: "nav.tab.login" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function ensureIoniconsLoaded() {
  if (typeof window === "undefined") return;
  if (customElements.get("ion-icon")) return;

  const existing = document.querySelector('script[data-ionicons="true"]');
  if (existing) return;

  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://unpkg.com/ionicons@7.2.2/dist/ionicons/ionicons.esm.js";
  script.setAttribute("data-ionicons", "true");
  document.head.appendChild(script);

  const nomodule = document.createElement("script");
  nomodule.noModule = true;
  nomodule.src = "https://unpkg.com/ionicons@7.2.2/dist/ionicons/ionicons.js";
  nomodule.setAttribute("data-ionicons", "true");
  document.head.appendChild(nomodule);
}

export function BottomNavigation() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const activeIndex = useMemo(() => {
    const found = tabs.findIndex((tab) => isActivePath(router.pathname, tab.href));
    return found < 0 ? 0 : found;
  }, [router.pathname]);

  const [active, setActive] = useState(activeIndex);

  useEffect(() => {
    ensureIoniconsLoaded();
    setMounted(true);
  }, []);

  useEffect(() => {
    setActive(activeIndex);
  }, [activeIndex]);

  return (
    <nav
      className="navigation"
      style={{
        opacity: mounted ? 1 : 0,
        pointerEvents: mounted ? "all" : "none",
        transition: "opacity 0.3s ease",
      }}
      aria-label="Primary"
    >
      <ul>
        {tabs.map((tab, idx) => {
          const isActive = idx === active;

          return (
            <li key={tab.key} className={isActive ? "active" : ""}>
              <Link
                href={tab.href}
                onClick={() => {
                  setActive(idx);
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="icon" aria-hidden="true">
                  <ion-icon name={tab.icon} />
                </span>
                <span className="text">{t(tab.labelKey)}</span>
              </Link>
            </li>
          );
        })}
        <div className="indicator" aria-hidden="true" />
      </ul>
    </nav>
  );
}