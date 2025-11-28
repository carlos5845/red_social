import { Hero } from "@/components/Hero";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
      <Hero />
    </div>
  );
}
