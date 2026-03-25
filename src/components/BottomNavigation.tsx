import Link from "next/link";
import { useRouter } from "next/router";

/**
 * BottomNavigation - Smart Fundi
 * 
 * Simple, clean bottom navigation with 5 tabs:
 * - Nyumbani (Home)
 * - Tafuta (Search)
 * - Matukio (Events)
 * - Wasifu (Profile)
 * - Ingia (Login)
 * 
 * Plain functional navigation - no custom animations or indicators.
 * Ready to be restyled from scratch.
 */

interface NavTab {
  id: string;
  label: string;
  href: string;
}

const tabs: NavTab[] = [
  { id: "home", label: "Nyumbani", href: "/" },
  { id: "search", label: "Tafuta", href: "/search" },
  { id: "events", label: "Matukio", href: "/events" },
  { id: "profile", label: "Wasifu", href: "/profile" },
  { id: "login", label: "Ingia", href: "/auth/signin" },
];

// Simple SVG icons - 24x24
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogInIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function getIcon(tabId: string, active: boolean) {
  switch (tabId) {
    case "home":
      return <HomeIcon active={active} />;
    case "search":
      return <SearchIcon active={active} />;
    case "events":
      return <CalendarIcon active={active} />;
    case "profile":
      return <UserIcon active={active} />;
    case "login":
      return <LogInIcon active={active} />;
    default:
      return <HomeIcon active={active} />;
  }
}

export function BottomNavigation() {
  const router = useRouter();

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

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      <ul className="bottom-nav-list">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <li key={tab.id} className="bottom-nav-item">
              <Link
                href={tab.href}
                className={`bottom-nav-link ${isActive ? "bottom-nav-link-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="bottom-nav-icon">
                  {getIcon(tab.id, isActive)}
                </span>
                <span className="bottom-nav-label">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}