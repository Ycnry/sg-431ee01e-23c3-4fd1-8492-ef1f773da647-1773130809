import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface NavTab {
  id: string;
  href: string;
  icon: string;
  labelKey: string;
}

// Role-specific tab configurations
const customerTabs: NavTab[] = [
  { id: "home", href: "/", icon: "home-outline", labelKey: "nav.tab.home" },
  { id: "search", href: "/search", icon: "search-outline", labelKey: "nav.tab.search" },
  { id: "messages", href: "/messages", icon: "chatbubble-outline", labelKey: "nav.tab.messages" },
  { id: "ai", href: "/help", icon: "sparkles-outline", labelKey: "nav.tab.ai" },
  { id: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
];

const fundiTabs: NavTab[] = [
  { id: "dashboard", href: "/dashboard/fundi", icon: "grid-outline", labelKey: "nav.tab.dashboard" },
  { id: "jobs", href: "/dashboard/fundi#jobs", icon: "clipboard-outline", labelKey: "nav.tab.jobs" },
  { id: "messages", href: "/messages", icon: "chatbubble-outline", labelKey: "nav.tab.messages" },
  { id: "earnings", href: "/dashboard/fundi#earnings", icon: "cash-outline", labelKey: "nav.tab.earnings" },
  { id: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
];

const shopTabs: NavTab[] = [
  { id: "dashboard", href: "/dashboard/shop", icon: "grid-outline", labelKey: "nav.tab.dashboard" },
  { id: "products", href: "/dashboard/shop#products", icon: "cart-outline", labelKey: "nav.tab.products" },
  { id: "orders", href: "/dashboard/shop#orders", icon: "bag-handle-outline", labelKey: "nav.tab.orders" },
  { id: "messages", href: "/messages", icon: "chatbubble-outline", labelKey: "nav.tab.messages" },
  { id: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
];

const adminTabs: NavTab[] = [
  { id: "dashboard", href: "/admin/dashboard", icon: "grid-outline", labelKey: "nav.tab.dashboard" },
  { id: "users", href: "/admin/dashboard#users", icon: "people-outline", labelKey: "nav.tab.users" },
  { id: "payments", href: "/admin/dashboard#payments", icon: "card-outline", labelKey: "nav.tab.payments" },
  { id: "reports", href: "/admin/dashboard#reports", icon: "analytics-outline", labelKey: "nav.tab.reports" },
  { id: "settings", href: "/admin/dashboard#settings", icon: "settings-outline", labelKey: "nav.tab.settings" },
];

const guestTabs: NavTab[] = [
  { id: "home", href: "/", icon: "home-outline", labelKey: "nav.tab.home" },
  { id: "search", href: "/search", icon: "search-outline", labelKey: "nav.tab.search" },
  { id: "events", href: "/events", icon: "calendar-outline", labelKey: "nav.tab.events" },
  { id: "login", href: "/auth/signin", icon: "log-in-outline", labelKey: "nav.tab.login" },
  { id: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
];

function getTabsForRole(userType: string | null): NavTab[] {
  switch (userType) {
    case "fundi":
      return fundiTabs;
    case "shop":
      return shopTabs;
    case "admin":
      return adminTabs;
    case "customer":
      return customerTabs;
    default:
      return guestTabs;
  }
}

export function BottomNavigation() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navRef = useRef<HTMLUListElement>(null);

  // Get tabs based on user role
  const tabs = getTabsForRole(user?.user_type || null);

  // Find active tab based on current route
  useEffect(() => {
    if (!mounted) return;
    
    const currentPath = router.pathname;
    let foundIndex = 0;
    
    // Find the best matching tab
    for (let i = 0; i < tabs.length; i++) {
      const tabHref = tabs[i].href.split("#")[0]; // Remove hash
      if (currentPath === tabHref || 
          (tabHref !== "/" && currentPath.startsWith(tabHref))) {
        foundIndex = i;
        break;
      }
    }
    
    setActiveIndex(foundIndex);
  }, [router.pathname, tabs, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle tab click
  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };

  if (!mounted) {
    return null;
  }

  // Calculate indicator position (each tab is 20% width, so 70px on 350px width)
  const tabWidth = 100 / tabs.length; // percentage
  const indicatorOffset = activeIndex * tabWidth;

  return (
    <nav
      className="smart-fundi-nav"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul ref={navRef}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <li
              key={tab.id}
              data-tab={tab.id}
              className={isActive ? "active" : ""}
            >
              <Link
                href={tab.href}
                onClick={() => handleTabClick(index)}
                aria-current={isActive ? "page" : undefined}
                aria-label={t(tab.labelKey)}
              >
                <span className="nav-icon">
                  <ion-icon name={tab.icon}></ion-icon>
                </span>
                <span className="nav-text">{t(tab.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div
        className="nav-indicator"
        style={{
          transform: `translateX(calc(${indicatorOffset}% + (${tabWidth}% - 70px) / 2))`,
        }}
        aria-hidden="true"
      />
    </nav>
  );
}