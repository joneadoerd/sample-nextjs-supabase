"use client";

import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/prisma/types";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
import { UserMenuItems } from "./user-menu";
import { LangSelector } from "./language-switcher";

interface MobileMenuProps {
  user: Profile | null;
  onLogout: () => Promise<void>;
}

export function MobileMenu({ user, onLogout }: MobileMenuProps) {
  return (
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
            <Link href="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                SS
              </span>
              <span className="font-bold text-xl">Services Store</span>
            </Link>
          </div>

          <nav className="flex flex-col gap-4 py-4">
            <Link
              href="/services"
              className={`text-base font-medium hover:text-primary transition-colors ${buttonVariants({ variant: "outline" })}`}
            >
              Browse Services
            </Link>
          </nav>

          <div className="mt-auto border-t pt-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage alt={user?.name || ""} />
                <AvatarFallback>
                  {user?.name?.substring(0, 2).toUpperCase() || "GU"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || "Guest"}</p>
                <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>

            <div className="space-y-4">
              <UserMenuItems user={user} onLogout={onLogout} onClose={() => document.body.click()} />
            </div>

            <div className="flex flex-col gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">Language</span>
                <LangSelector isMobile />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <ThemeToggle variant="outline" showLabel />
              </div>
            </div>
          </div>
        </SheetTitle>
      </SheetContent>
    </Sheet>
  );
}