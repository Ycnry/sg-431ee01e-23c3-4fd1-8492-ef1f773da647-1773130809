import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * BottomNavigation - Smart Fundi
 * 
 * 5 equally spaced tabs (20% each):
 * - Nyumbani (home)
 * - Tafuta (search)
 * - Matukio (calendar/events)
 * - Wasifu (profile)
 * - Ingia (login)
 * 
 * Orange background (#F5A623)
 * White icons/labels, deep blue (#1A3C6E) when active
 */

interface NavTab {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const tabs: NavTab[] = [
  { id: "home", label: "Nyumbani", icon: "home-outline", href: "/" },
  { id: "search", label: "Tafuta", icon: "search-outline", href: "/search" },
  { id: "events", label: "Matukio", icon: "calendar-outline", href: "/events" },
  { id: "profile", label: "Wasifu", icon: "person-outline", href: "/profile" },
  { id: "login", label: "Ingia", icon: "log-in-outline", href: "/auth/signin" },
];

export function BottomNavigation() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which tab is active based on current route
  const getActiveTab = (): string => {
    const path = router.pathname;
    
    if (path === "/") return "home";
    if (path.startsWith("/search")) return "search";
    if (path.startsWith("/events")) return "events";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/auth")) return "login";
    
    return "home";
  };

  const activeTab = getActiveTab();

  if (!mounted) {
    return null;
  }

  return (
    <nav
      className="sf-bottom-nav"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="sf-nav-list">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <li key={tab.id} className="sf-nav-item">
              <Link
                href={tab.href}
                className={`sf-nav-link ${isActive ? "sf-nav-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="sf-nav-icon">
                  <ion-icon name={tab.icon}></ion-icon>
                </span>
                <span className="sf-nav-label">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}