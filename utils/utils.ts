import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 */
export async function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  const locale = await getLocale();
  return redirect({
    href: `${path}?${type}=${encodeURIComponent(message)}`,
    locale: locale,
  });
}
