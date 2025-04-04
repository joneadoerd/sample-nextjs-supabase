"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/actions/auth-actions";
import { Profile } from "@/prisma/types";
import { Link } from "@/i18n/navigation";
import { LangSelector } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { UserMenuItems } from "./user-menu";
import { MobileMenu } from "./mobile-menu";

interface HeaderProps {
  user: Profile | null;
}

export function Header({ user }: HeaderProps) {
  const handleLogout = async () => {
    await signOutAction();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            SS
          </span>
          <span className="font-bold text-xl hidden sm:inline-block">
            Services Store
          </span>
        </Link>

        <nav className={`hidden md:flex items-center gap-6 ${buttonVariants({ variant: "outline" })}`}>
          <Link href="/services" className="font-medium hover:text-primary transition-colors">
            Browse Services
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LangSelector />
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full hidden sm:flex"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage alt={user?.name || ""} />
                  <AvatarFallback>
                    {user?.name?.substring(0, 2).toUpperCase() || "GU"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Guest"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <UserMenuItems user={user} onLogout={handleLogout} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <MobileMenu user={user} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}