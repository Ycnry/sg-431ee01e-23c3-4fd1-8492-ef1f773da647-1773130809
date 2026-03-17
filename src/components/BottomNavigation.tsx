import { useRouter } from "next/router";
import Link from "next/link";
import { Home, Search, Calendar, MessageSquare, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: typeof Home;
  labelEn: string;
  labelSw: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, labelEn: "Home", labelSw: "Nyumbani" },
  { href: "/search", icon: Search, labelEn: "Search", labelSw: "Tafuta" },
  { href: "/events", icon: Calendar, labelEn: "Events", labelSw: "Matukio" },
  { href: "/messages", icon: MessageSquare, labelEn: "Messages", labelSw: "Ujumbe", requiresAuth: true },
  { href: "/profile", icon: User, labelEn: "Profile", labelSw: "Wasifu" },
];

export function BottomNavigation() {
  const router = useRouter();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") {
      return router.pathname === "/";
    }
    return router.pathname.startsWith(href);
  };

  const filteredItems = navItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) {
      return false;
    }
    return true;
  });

  // Add login item if not authenticated
  const displayItems = isAuthenticated 
    ? filteredItems 
    : [...filteredItems.filter(i => !i.requiresAuth), { href: "/auth/signin", icon: User, labelEn: "Login", labelSw: "Ingia" }];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border safe-bottom animate-slide-up">
      <div className="flex items-center justify-around h-16 px-2">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const label = language === "en" ? item.labelEn : item.labelSw;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-1 py-2 transition-colors touch-target",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", active && "text-primary")} />
              <span className={cn(
                "text-[10px] font-medium truncate max-w-full",
                active && "text-primary"
              )}>
                {label}
              </span>
              {active && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}