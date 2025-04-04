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
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageOption {
  value: Locale;
  label: string;
}

const languages: LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" }
];

export function LangSelector({ isMobile }: { isMobile?: boolean }) {
  const locale = useLocale() as Locale;
  const [currentLocale, setCurrentLocale] = React.useState(locale);
  const router = useRouter();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  const handleLanguageChange = (value: Locale) => {
    setCurrentLocale(value);
    startTransition(() => {
      router.replace(pathname, { locale: value });
      router.refresh();
    });
  };

  if (isMobile) {
    return (
      <Select value={currentLocale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue>
            {languages.find(lang => lang.value === currentLocale)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem 
              key={language.value} 
              value={language.value}
            >
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden sm:flex"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => handleLanguageChange(language.value)}
            className={cn(
              "flex items-center gap-2",
              currentLocale === language.value && "bg-accent"
            )}
          >
            <Check 
              className={cn(
                "h-4 w-4",
                currentLocale === language.value ? "opacity-100" : "opacity-0"
              )} 
            />
            <span>{language.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}