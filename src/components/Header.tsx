
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { Menu, Wrench, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export function Header() {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    if (router.pathname !== "/") {
      router.push(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Wrench className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">
              SMART<span className="text-orange-500"> FUNDI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/") ? "text-blue-600" : ""}`}
            >
              {t("nav.home")}
            </Link>
            <button 
              onClick={() => scrollToSection("fundis")} 
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {t("nav.fundis")}
            </button>
            <button 
              onClick={() => scrollToSection("shops")} 
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {t("nav.shops")}
            </button>
            <button 
              onClick={() => scrollToSection("events")} 
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {t("nav.events")}
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/search" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/search") ? "text-blue-600" : ""}`}
            >
              {language === "en" ? "Search" : "Tafuta"}
            </Link>
            <Link 
              href="/events" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/events") ? "text-blue-600" : ""}`}
            >
              {language === "en" ? "Events" : "Matukio"}
            </Link>
            <Link 
              href="/messages" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/messages") ? "text-blue-600" : ""}`}
            >
              {language === "en" ? "Messages" : "Ujumbe"}
            </Link>
            <Link 
              href="/profile" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/profile") ? "text-blue-600" : ""}`}
            >
              {language === "en" ? "Profile" : "Wasifu"}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeSwitch />
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                {t("nav.signin")}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700">
                {t("nav.signup")}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-3">
              <Link 
                href="/" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/") ? "text-blue-600" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <button 
                onClick={() => scrollToSection("fundis")} 
                className="text-sm font-medium hover:text-blue-600 transition-colors text-left"
              >
                {t("nav.fundis")}
              </button>
              <button 
                onClick={() => scrollToSection("shops")} 
                className="text-sm font-medium hover:text-blue-600 transition-colors text-left"
              >
                {t("nav.shops")}
              </button>
              <button 
                onClick={() => scrollToSection("events")} 
                className="text-sm font-medium hover:text-blue-600 transition-colors text-left"
              >
                {t("nav.events")}
              </button>
              <Link 
                href="/search" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/search") ? "text-blue-600" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "en" ? "Search" : "Tafuta"}
              </Link>
              <Link 
                href="/events" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/events") ? "text-blue-600" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "en" ? "Events" : "Matukio"}
              </Link>
              <Link 
                href="/messages" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/messages") ? "text-blue-600" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "en" ? "Messages" : "Ujumbe"}
              </Link>
              <Link 
                href="/profile" 
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive("/profile") ? "text-blue-600" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "en" ? "Profile" : "Wasifu"}
              </Link>
              <div className="flex gap-2 pt-2">
                <Link href="/auth/signin" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    {t("nav.signin")}
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex-1">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>
                    {t("nav.signup")}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
