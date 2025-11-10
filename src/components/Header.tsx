
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { Menu, Search, Wrench, Store, Calendar, MessageSquare, User, LogOut } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export function Header() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/search", label: language === "en" ? "Find Fundi" : "Tafuta Fundi", icon: Search },
    { href: "/search?type=shop", label: language === "en" ? "Shops" : "Maduka", icon: Store },
    { href: "/events", label: language === "en" ? "Events" : "Matukio", icon: Calendar },
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

            {isAuthenticated && authenticatedLinks.map((link) => {
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

            {!isAuthenticated ? (
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
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.photo} alt={user?.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{language === "en" ? "Profile" : "Wasifu"}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages" className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>{language === "en" ? "Messages" : "Ujumbe"}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{language === "en" ? "Sign Out" : "Toka"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

                  {isAuthenticated && (
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

                  {!isAuthenticated ? (
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
                  ) : (
                    <>
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-red-600"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        {language === "en" ? "Sign Out" : "Toka"}
                      </Button>
                    </>
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
