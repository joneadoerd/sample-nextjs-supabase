"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Locale, routing } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Check, Globe } from "lucide-react";
import { Button } from "./ui/button";

export const LangSelector = ({ isMobile }: { isMobile?: boolean }) => {
  const locale = useLocale() as Locale;
  const [currentLocale, setCurrentLocale] = React.useState(locale);
  const router = useRouter();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  function onSelectChange(value: Locale) {
    setCurrentLocale(value);
    startTransition(() => {
      router.replace(pathname, { locale: value });
    });
  }

  return (
    <>
      {isMobile ? (
        <Select onValueChange={onSelectChange} value={currentLocale}>
          <SelectTrigger className="w-fit flex-wrap px-5 py-2 text-sm border rounded-lg shadow-sm focus:ring focus:ring-primary/50">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">Arabic</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Select language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {routing.locales.map((lang) => (
              <DropdownMenuItem
                key={lang}
                onClick={() => onSelectChange(lang)}
                className={
                  currentLocale === lang
                    ? "bg-accent text-accent-foreground"
                    : ""
                }
              >
                <Check
                  className={
                    currentLocale === lang
                      ? "bg-accent text-accent-foreground"
                      : "hidden"
                  }
                />
                {lang}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
