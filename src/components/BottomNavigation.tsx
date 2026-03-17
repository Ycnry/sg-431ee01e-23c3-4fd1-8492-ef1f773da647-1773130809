import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface NavTab {
  key: string;
  href: string;
  icon: string;
  labelKey: string;
}

const roleBasedTabs: Record<string, NavTab[]> = {
  customer: [
    { key: "home", href: "/", icon: "home-outline", labelKey: "nav.tab.home" },
    { key: "search", href: "/search", icon: "search-outline", labelKey: "nav.tab.search" },
    { key: "messages", href: "/messages", icon: "chatbubble-outline", labelKey: "nav.tab.messages" },
    { key: "ai", href: "/ai-assistant", icon: "sparkles-outline", labelKey: "nav.tab.ai" },
    { key: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
  ],
  fundi: [
    { key: "dashboard", href: "/dashboard/fundi", icon: "grid-outline", labelKey: "nav.tab.dashboard" },
    { key: "jobs", href: "/dashboard/fundi#jobs", icon: "clipboard-outline", labelKey: "nav.tab.jobs" },
    { key: "messages", href: "/messages", icon: "chatbubble-outline", labelKey: "nav.tab.messages" },
    { key: "earnings", href: "/dashboard/fundi#earnings", icon: "cash-outline", labelKey: "nav.tab.earnings" },
    { key: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
  ],
  shop: [
    { key: "dashboard", href: "/dashboard/shop", icon: "grid-outline", labelKey: "nav.tab.dashboard" },
    { key: "products", href: "/dashboard/shop#products", icon: "cart-outline", labelKey: "nav.tab.products" },
    { key: "orders", href: "/dashboard/shop#orders", icon: "bag-handle-outline", labelKey: "nav.tab.orders" },
    { key: "messages", href: "/messages", icon: "chatbubble-outline", labelKey: "nav.tab.messages" },
    { key: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
  ],
  admin: [
    { key: "dashboard", href: "/admin/dashboard", icon: "grid-outline", labelKey: "nav.tab.dashboard" },
    { key: "users", href: "/admin/dashboard#users", icon: "people-outline", labelKey: "nav.tab.users" },
    { key: "payments", href: "/admin/dashboard#payments", icon: "card-outline", labelKey: "nav.tab.payments" },
    { key: "reports", href: "/admin/dashboard#reports", icon: "analytics-outline", labelKey: "nav.tab.reports" },
    { key: "settings", href: "/admin/dashboard#settings", icon: "settings-outline", labelKey: "nav.tab.settings" },
  ],
  guest: [
    { key: "home", href: "/", icon: "home-outline", labelKey: "nav.tab.home" },
    { key: "search", href: "/search", icon: "search-outline", labelKey: "nav.tab.search" },
    { key: "events", href: "/events", icon: "calendar-outline", labelKey: "nav.tab.events" },
    { key: "signin", href: "/auth/signin", icon: "log-in-outline", labelKey: "nav.tab.login" },
    { key: "profile", href: "/profile", icon: "person-outline", labelKey: "nav.tab.profile" },
  ],
};

function getActiveTabIndex(pathname: string, tabs: NavTab[]): number {
  const index = tabs.findIndex((tab) => {
    if (tab.href === "/") return pathname === "/";
    return pathname.startsWith(tab.href.split("#")[0]);
  });
  return index >= 0 ? index : 0;
}

export function BottomNavigation() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = user?.userType || "guest";
  const tabs = roleBasedTabs[userRole] || roleBasedTabs.guest;
  const activeIndex = getActiveTabIndex(router.pathname, tabs);

  if (!mounted) {
    return null;
  }

  return (
    <nav
      className="magic-navigation fixed bottom-0 left-0 right-0 z-[1000]"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="flex items-center justify-around relative h-[70px] m-0 p-0 list-none">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <li
              key={tab.key}
              className={`nav-item relative flex-1 ${isActive ? "active" : ""}`}
              style={{ zIndex: isActive ? 1 : 0 }}
            >
              <Link
                href={tab.href}
                className="nav-link relative flex flex-col items-center justify-center w-full h-full no-underline"
                aria-current={isActive ? "page" : undefined}
                aria-label={t(tab.labelKey)}
              >
                <span className="nav-icon block text-[1.75rem] transition-transform duration-300 ease-out">
                  <ion-icon name={tab.icon} aria-hidden="true" />
                </span>
                <span className="nav-text block text-[0.75rem] font-medium transition-all duration-300 ease-out">
                  {t(tab.labelKey)}
                </span>
              </Link>
            </li>
          );
        })}
        <div
          className="indicator absolute rounded-full transition-transform duration-300"
          style={{
            transform: `translateX(calc((100% / ${tabs.length}) * ${activeIndex} + (100% / ${tabs.length} / 2) - 35px))`,
          }}
          aria-hidden="true"
        />
      </ul>
    </nav>
  );
}