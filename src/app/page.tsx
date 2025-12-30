import { Hero } from "@/components/Hero";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PlatinumSocialHero from "@/components/hero2";
export default async function Home() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/inicio");
  }

  return (
    <div className="min-h-screen bg-black">
      <PlatinumSocialHero />
    </div>
  );
}
