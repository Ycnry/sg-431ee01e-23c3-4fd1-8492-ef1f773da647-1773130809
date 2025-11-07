import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { Menu, Wrench } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function Header() {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">
                SMART<span className="text-orange-500"> FUNDI</span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {t("nav.home")}
            </a>
            <a href="#fundis" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {t("nav.fundis")}
            </a>
            <a href="#shops" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {t("nav.shops")}
            </a>
            <a href="#events" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {t("nav.events")}
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {language === "en" ? "Search" : "Tafuta"}
            </Link>
            <Link href="/events" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {language === "en" ? "Events" : "Matukio"}
            </Link>
            <Link href="/messages" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {language === "en" ? "Messages" : "Ujumbe"}
            </Link>
            <Link href="/profile" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {language === "en" ? "Profile" : "Wasifu"}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeSwitch />
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              {t("nav.signin")}
            </Button>
            <Button size="sm" className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700">
              {t("nav.signup")}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
                {t("nav.home")}
              </a>
              <a href="#fundis" className="text-sm font-medium hover:text-blue-600 transition-colors">
                {t("nav.fundis")}
              </a>
              <a href="#shops" className="text-sm font-medium hover:text-blue-600 transition-colors">
                {t("nav.shops")}
              </a>
              <a href="#events" className="text-sm font-medium hover:text-blue-600 transition-colors">
                {t("nav.events")}
              </a>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  {t("nav.signin")}
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {t("nav.signup")}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
