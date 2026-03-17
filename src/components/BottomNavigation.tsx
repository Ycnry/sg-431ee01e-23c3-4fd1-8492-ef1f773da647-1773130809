import Link from "next/link";
import { useRouter } from "next/router";
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

export function BottomNavigation() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {tabs.map((tab) => {
          const isActive = isActivePath(router.pathname, tab.href);

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <ion-icon name={tab.icon} style={{ fontSize: "24px" }} />
              <span className="text-xs font-medium">{t(tab.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}