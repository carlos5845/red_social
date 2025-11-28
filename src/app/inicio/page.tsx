import { Dashboard } from "@/components/Dashboard";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPosts } from "@/app/actions/post";

export default async function InicioPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch posts
  const posts = await getPosts();

  // Fetch current user profile for avatar
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  const userAvatar = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <div className="pt-16">
      <Dashboard posts={posts} userAvatar={userAvatar} />
    </div>
  );
}
