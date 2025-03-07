import { Link } from "@/i18n/navigation";
import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t =await getTranslations("HomePage");

  return (
    <>
      <Hero />
      <h1>{t("title")}</h1>
      <Link href="/about">{t("about")}</Link>
   
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main>
    </>
  );
}
