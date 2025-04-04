import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUserProfile } from "@/actions/user-actions";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import Loading from "./loading";
import { Header } from "@/components/header";

export const metadata = {
  title: "Home",
  description: " My Portfolio",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);
  let user = null;
  try {
    user = await getCurrentUserProfile();
  } catch (error) {
    user = null;
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <html lang={locale} suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <Header user={user} />
            </nav>

            <Suspense fallback={<Loading />}>{children}</Suspense>
            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              <p>
                Powered by{" "}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Supabase
                </a>
              </p>
            </footer>
            <SpeedInsights />
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
