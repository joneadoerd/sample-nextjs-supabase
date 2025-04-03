import { routing } from "@/i18n/routing";
import { createServerClient } from "@supabase/ssr";
import { getLocale } from "next-intl/server";
import { type NextRequest, NextResponse } from "next/server";

export const publicRoutes: string[] = [
  "/",
  "/sign-in",
  "forgot-password",
  "sign-up",
];

export const updateSession = async (
  request: NextRequest,
  response: NextResponse
) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();
    const { nextUrl } = request;
    const { locales } = routing;
    const publicPathnameRegex = RegExp(
      `^(/(${locales.join("|")}))?(${publicRoutes
        .flatMap((p) => (p === "/" ? ["", "/"] : p))
        .join("|")})/?$`,
      "i"
    );
    const isPublicRoute = publicPathnameRegex.test(nextUrl.pathname);
    if (!isPublicRoute && user.error) {
      return NextResponse.redirect(new URL(`/sign-in`, request.url));
    }

    // if (request.nextUrl.pathname === "/" && !user.error) {
    //   return NextResponse.redirect(
    //     new URL(`/${locale || routing.defaultLocale}`, request.url)
    //   );
    // }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    console.error("Failed to create Supabase client: ", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
