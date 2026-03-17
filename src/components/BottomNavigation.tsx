import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

type TabKey = "home" | "search" | "events" | "profile" | "login";

interface NavTab {
  key: TabKey;
  href: string;
  icon: string;
  label: string;
}

const tabs: NavTab[] = [
  { key: "home", href: "/", icon: "home-outline", label: "Nyumbani" },
  { key: "search", href: "/search", icon: "search-outline", label: "Tafuta" },
  { key: "events", href: "/events", icon: "calendar-outline", label: "Matukio" },
  { key: "profile", href: "/profile", icon: "person-outline", label: "Wasifu" },
  { key: "login", href: "/auth/signin", icon: "log-in-outline", label: "Ingia" },
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

  const activeIndex = useMemo(() => {
    const found = tabs.findIndex((t) => isActivePath(router.pathname, t.href));
    return found < 0 ? 0 : found;
  }, [router.pathname]);

  const [active, setActive] = useState(activeIndex);

  useEffect(() => {
    ensureIoniconsLoaded();
  }, []);

  useEffect(() => {
    setActive(activeIndex);
  }, [activeIndex]);

  return (
    <nav className="navigation" aria-label="Primary">
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
                <span className="text">{tab.label}</span>
              </Link>
            </li>
          );
        })}
        <div className="indicator" aria-hidden="true" />
      </ul>
    </nav>
  );
}