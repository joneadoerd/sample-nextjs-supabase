import { isAdmin } from "@/actions/checkAdmin";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  if (!admin) {
    return <p>Access Denied</p>;
  }
  return <>{children}</>;
}
