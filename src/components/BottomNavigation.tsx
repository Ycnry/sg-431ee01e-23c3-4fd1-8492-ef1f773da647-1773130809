import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * BottomNavigation - Smart Fundi
 * 
 * 5 equally spaced tabs (20% each):
 * - Nyumbani (home icon)
 * - Tafuta (search icon)
 * - Matukio (calendar icon)
 * - Wasifu (person icon)
 * - Ingia (login icon)
 * 
 * Orange background (#F5A623)
 * White icons/labels for inactive tabs
 * Active tab: icon lifts up into deep blue (#1A3C6E) circle bubble
 * Bar height: 65px
 * Icons: 24px inline SVGs
 */

interface NavTab {
  id: string;
  label: string;
  href: string;
  index: number;
}

const tabs: NavTab[] = [
  { id: "home", label: "Nyumbani", href: "/", index: 0 },
  { id: "search", label: "Tafuta", href: "/search", index: 1 },
  { id: "events", label: "Matukio", href: "/events", index: 2 },
  { id: "profile", label: "Wasifu", href: "/profile", index: 3 },
  { id: "login", label: "Ingia", href: "/auth/signin", index: 4 },
];

// Inline SVG icons - 24x24px
function HomeIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9 22V12H15V22" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="11" 
        cy="11" 
        r="7" 
        stroke={color} 
        strokeWidth="2"
      />
      <path 
        d="M21 21L16.5 16.5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect 
        x="3" 
        y="4" 
        width="18" 
        height="18" 
        rx="2" 
        stroke={color} 
        strokeWidth="2"
      />
      <path 
        d="M16 2V6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M8 2V6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M3 10H21" 
        stroke={color} 
        strokeWidth="2"
      />
    </svg>
  );
}

function PersonIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="12" 
        cy="7" 
        r="4" 
        stroke={color} 
        strokeWidth="2"
      />
      <path 
        d="M4 21V19C4 16.7909 5.79086 15 8 15H16C18.2091 15 20 16.7909 20 19V21" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}

function LoginIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M10 17L15 12L10 7" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M15 12H3" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getIcon(tabId: string, color: string) {
  switch (tabId) {
    case "home":
      return <HomeIcon color={color} />;
    case "search":
      return <SearchIcon color={color} />;
    case "events":
      return <CalendarIcon color={color} />;
    case "profile":
      return <PersonIcon color={color} />;
    case "login":
      return <LoginIcon color={color} />;
    default:
      return <HomeIcon color={color} />;
  }
}

export function BottomNavigation() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  if (!mounted) {
    return null;
  }

  return (
    <nav
      className="sf-bottom-nav"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Floating bubble indicator */}
      <div 
        className="sf-bubble"
        style={{
          transform: `translateX(calc(20vw * ${activeIndex} + 10vw - 35px))`,
        }}
      >
        <div className="sf-bubble-circle">
          {getIcon(activeTab, "#FFFFFF")}
        </div>
      </div>

      <ul className="sf-nav-list">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const iconColor = "#FFFFFF";
          
          return (
            <li key={tab.id} className="sf-nav-item">
              <Link
                href={tab.href}
                className={`sf-nav-link ${isActive ? "sf-nav-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={`sf-nav-icon ${isActive ? "sf-nav-icon-hidden" : ""}`}>
                  {getIcon(tab.id, iconColor)}
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