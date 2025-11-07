
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, Search, Wrench, Store, Calendar } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export function Header() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [isSignedIn] = useState(false);

  const navLinks = [
    { href: "/search", label: language === "en" ? "Find Fundi" : "Tafuta Fundi", icon: Search },
    { href: "/search?type=shop", label: language === "en" ? "Shops" : "Maduka", icon: Store },
    { href: "/events", label: language === "en" ? "Events" : "Matukio", icon: Calendar },
  ];

  const authenticatedLinks = [
    { href: "/messages", label: language === "en" ? "Messages" : "Ujumbe", icon: Wrench },
    { href: "/profile", label: language === "en" ? "Profile" : "Wasifu", icon: Store },
  ];

  const isActive = (href: string) => {
    if (href === "/search?type=shop") {
      return router.pathname === "/search" && router.query.type === "shop";
    }
    return router.pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-blue-600">SMART</span>{" "}
                <span className="text-orange-500">FUNDI</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive(link.href) ? "default" : "ghost"}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}

            {isSignedIn && authenticatedLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive(link.href) ? "default" : "ghost"}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeSwitch />

            {!isSignedIn && (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">
                    {language === "en" ? "Sign In" : "Ingia"}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>
                    {language === "en" ? "Sign Up" : "Jisajili"}
                  </Button>
                </Link>
              </div>
            )}

            {isSignedIn && (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost">
                    {language === "en" ? "Profile" : "Wasifu"}
                  </Button>
                </Link>
              </div>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href}>
                        <Button
                          variant={isActive(link.href) ? "default" : "ghost"}
                          className="w-full justify-start gap-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}

                  {isSignedIn && (
                    <>
                      <div className="border-t my-2"></div>
                      {authenticatedLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link key={link.href} href={link.href}>
                            <Button
                              variant={isActive(link.href) ? "default" : "ghost"}
                              className="w-full justify-start gap-2"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </Button>
                          </Link>
                        );
                      })}
                    </>
                  )}

                  <div className="border-t my-2"></div>

                  {!isSignedIn && (
                    <>
                      <Link href="/auth/signin">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {language === "en" ? "Sign In" : "Ingia"}
                        </Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {language === "en" ? "Sign Up" : "Jisajili"}
                        </Button>
                      </Link>
                    </>
                  )}

                  {isSignedIn && (
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {language === "en" ? "Profile" : "Wasifu"}
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
