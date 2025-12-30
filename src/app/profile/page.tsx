import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import Image from "next/image";
export default async function ProfilePage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile data if needed, for now just user metadata
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-black text-zinc-200 pt-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Perfil</h1>
          <ProfileEditDialog profile={profile} />
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-2 border-zinc-800 object-cover"
              />
            ) : user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-2 border-zinc-800"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white">
                {profile?.username?.[0]?.toUpperCase() ||
                  user.email?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {profile?.full_name ||
                  user.user_metadata?.full_name ||
                  "Usuario"}
              </h2>
              <p className="text-zinc-500">
                @{profile?.username || user.email?.split("@")[0]}
              </p>
            </div>
          </div>

          {profile?.bio && (
            <div className="pt-4 border-t border-white/5">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Bio
              </label>
              <p className="text-zinc-300 mt-1">{profile.bio}</p>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Email
              </label>
              <p className="text-white mt-1">{user.email}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                ID de Usuario
              </label>
              <p className="text-zinc-400 font-mono text-xs mt-1">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
