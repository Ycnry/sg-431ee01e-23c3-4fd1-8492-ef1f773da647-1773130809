import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { IonIcon } from "@ionic/react";
import { calendarOutline, homeOutline, logInOutline, personOutline, searchOutline } from "ionicons/icons";

type TabKey = "home" | "search" | "events" | "profile" | "login";

interface NavTab {
  key: TabKey;
  href: string;
  icon: string;
  label: string;
}

const tabs: NavTab[] = [
  { key: "home", href: "/", icon: homeOutline, label: "Nyumbani" },
  { key: "search", href: "/search", icon: searchOutline, label: "Tafuta" },
  { key: "events", href: "/events", icon: calendarOutline, label: "Matukio" },
  { key: "profile", href: "/profile", icon: personOutline, label: "Wasifu" },
  { key: "login", href: "/auth/signin", icon: logInOutline, label: "Ingia" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BottomNavigation() {
  const router = useRouter();

  const activeIndex = useMemo(() => {
    const found = tabs.findIndex((t) => isActivePath(router.pathname, t.href));
    return found < 0 ? 0 : found;
  }, [router.pathname]);

  const [active, setActive] = useState(activeIndex);

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
                  <IonIcon icon={tab.icon} />
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