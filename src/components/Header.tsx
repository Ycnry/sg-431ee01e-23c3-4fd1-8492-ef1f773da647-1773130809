import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Search, Store, Calendar, MessageSquare, User, LogOut, HelpCircle, Wrench, X } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export function Header() {
  const { language } = useLanguage();
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/search", label: language === "en" ? "Find Fundi" : "Tafuta Fundi", icon: Search },
    { href: "/search?type=shop", label: language === "en" ? "Shops" : "Maduka", icon: Store },
    { href: "/events", label: language === "en" ? "Events" : "Matukio", icon: Calendar },
    { href: "/help", label: language === "en" ? "Help" : "Msaada", icon: HelpCircle },
  ];

  const authenticatedLinks = [
    { href: "/messages", label: language === "en" ? "Messages" : "Ujumbe", icon: MessageSquare },
    { href: "/profile", label: language === "en" ? "Profile" : "Wasifu", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/search?type=shop") {
      return router.pathname === "/search" && router.query.type === "shop";
    }
    return router.pathname === href;
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="bg-primary p-1.5 sm:p-2 rounded-lg">
              <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-base sm:text-xl">
              <span className="text-primary">SMART</span>{" "}
              <span className="text-orange-500">FUNDI</span>
            </span>
          </Link>

          {/* Right side actions - Logo, Language, Theme, Menu only */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language and Theme toggles */}
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <ThemeSwitch />
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[320px] p-0">
                <SheetHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="bg-primary p-1.5 rounded-lg">
                        <Wrench className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="font-bold">
                        <span className="text-primary">SMART</span>{" "}
                        <span className="text-orange-500">FUNDI</span>
                      </span>
                    </SheetTitle>
                  </div>
                </SheetHeader>
                
                <div className="flex flex-col h-[calc(100%-65px)] overflow-y-auto">
                  {/* User Info (if authenticated) */}
                  {isAuthenticated && user && (
                    <div className="p-4 border-b bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.photo} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex-1 p-2">
                    <div className="space-y-1">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link key={link.href} href={link.href} onClick={closeMobileMenu}>
                            <Button
                              variant={isActive(link.href) ? "secondary" : "ghost"}
                              className="w-full justify-start gap-3 h-12 text-base"
                            >
                              <Icon className="h-5 w-5" />
                              {link.label}
                            </Button>
                          </Link>
                        );
                      })}

                      {isAuthenticated && (
                        <>
                          <div className="my-2 border-t" />
                          {authenticatedLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link key={link.href} href={link.href} onClick={closeMobileMenu}>
                                <Button
                                  variant={isActive(link.href) ? "secondary" : "ghost"}
                                  className="w-full justify-start gap-3 h-12 text-base"
                                >
                                  <Icon className="h-5 w-5" />
                                  {link.label}
                                </Button>
                              </Link>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </nav>

                  {/* Settings & Auth */}
                  <div className="border-t p-4 space-y-3">
                    {/* Theme & Language toggles */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">
                        {language === "en" ? "Settings" : "Mipangilio"}
                      </span>
                      <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeSwitch />
                      </div>
                    </div>

                    {/* Auth Buttons */}
                    {!isAuthenticated ? (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Link href="/auth/signin" onClick={closeMobileMenu}>
                          <Button variant="outline" className="w-full h-11">
                            {language === "en" ? "Sign In" : "Ingia"}
                          </Button>
                        </Link>
                        <Link href="/auth/signup" onClick={closeMobileMenu}>
                          <Button className="w-full h-11">
                            {language === "en" ? "Sign Up" : "Jisajili"}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {language === "en" ? "Sign Out" : "Toka"}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}