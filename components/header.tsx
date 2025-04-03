"use client";

import { useState } from "react";
import {
  Menu,
  Globe,
  User,
  LogOut,
  Moon,
  Sun,
  Server,
  LogIn,
  SquareDashedBottomCodeIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { signOutAction } from "@/actions/auth-actions";
import { Profile } from "@/prisma/types";
import { routing } from "@/i18n/routing";
import { getServiceByUserId } from "@/lib/service-actions";
import { Link, useRouter } from "@/i18n/navigation";
import { LangSelector } from "./language-switcher";
import { Select } from "./ui/select";

// Available languages

export function Header({
  user,
  locale,
}: {
  user: Profile | null;
  locale: string;
}) {
  const router = useRouter();
  const {systemTheme, theme, setTheme} = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [currentLanguage, setCurrentLanguage] = useState(locale);
  const isAdmin = user?.role === "admin";
  const handleLanguageChange = (langCode: string) => {
    document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
    setCurrentLanguage(langCode);
    // In a real app, you would update the app's locale/language here
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleLogout = async () => {
    // In a real app, you would handle logout logic here
    await signOutAction();
    console.log("Logging out...");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              SS
            </span>
            <span className="font-bold text-xl hidden sm:inline-block">
              Services Store
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/services"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Browse Services
          </Link>
        </nav>

        {/* User Menu, Language Selector, and Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <LangSelector/>
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="hidden sm:flex"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full hidden sm:flex"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage alt={user?.name || ""} />
                  <AvatarFallback>
                    {user ? user?.name.substring(0, 2).toUpperCase() : "LO"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {user ? user.name : "Guest"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user ? user.email : ""}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEditProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  const { service } = await getServiceByUserId(user?.id || "");
                  // console.log(service)
                  if (service) {
                    router.push(`/services/${user?.id}/edit`);
                  } else {
                    router.push(`/services/${user?.id}/add`);
                  }
                }}
              >
                <Server className="mr-2 h-4 w-4" />
                <span>My Service</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => router.push("/admin")}>
                  <SquareDashedBottomCodeIcon className="mr-2 h-4 w-4" />
                  <span>Admin Settings</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                {user ? (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    <Link href="/sign-in">Sign in</Link>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      SS
                    </span>
                    <span className="font-bold text-xl">Services Store</span>
                  </div>
                </div>

                <nav className="flex flex-col gap-4 py-4">
                  <Link
                    href="/services"
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    Browse Services
                  </Link>
                  <Button
                    onClick={() => {
                      router.push(`/services/${user?.id}`);
                      router.refresh();
                    }}
                    className="text-base font-medium  "
                  >
                    My Service
                  </Button>
                  {isAdmin && (
                    <Button onClick={() => router.push("/admin")}>
                      <SquareDashedBottomCodeIcon className="mr-2 h-4 w-4" />
                      Admin Settings
                    </Button>
                  )}
                </nav>

                <div className="mt-auto border-t pt-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage alt={user?.name} />
                      <AvatarFallback>
                        {user?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user ? user.name : "Guest"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user ? user.email : ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={handleEditProfile}
                      className="w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      {user ? (
                        <>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          <Link href="/sign-in">Sign in</Link>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Language</span>
                    </div>
                    <LangSelector isMobile={true} />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      {theme === "dark" ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                      <span className="text-sm">Theme</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? "Light" : "Dark"}
                    </Button>
                  </div>
                </div>
              </SheetTitle>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
