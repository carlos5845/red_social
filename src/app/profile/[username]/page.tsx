import { getProfileByUsername } from "@/app/actions/profile";
import { getPostsByUserId } from "@/app/actions/post";
import { PostCard } from "@/components/PostCard";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { MessageButton } from "@/components/chat/MessageButton";
interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const posts = await getPostsByUserId(profile.id);

  // Get current user to enable delete button on own posts
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  return (
    <div className="min-h-screen bg-black text-zinc-200 pt-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-6 mb-8">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-20 h-20 rounded-full border-2 border-zinc-800 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white">
                {profile.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-zinc-500">@{profile.username}</p>
            </div>
          </div>

          {profile.bio && (
            <div className="pt-4 border-t border-white/5">
              <p className="text-zinc-300">{profile.bio}</p>
            </div>
          )}

          <div className="flex gap-6 pt-4 border-t border-white/5 text-sm items-center justify-between">
            <div className="flex gap-1">
              <span className="font-bold text-white">{posts.length}</span>
              <span className="text-zinc-500">Publicaciones</span>
            </div>

            {/* Action Buttons */}
            {currentUserId && currentUserId !== profile.id && (
              <div className="flex gap-2">
                {/* Future: Follow Button */}
                <MessageButton targetUserId={profile.id} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">
            Publicaciones
          </h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <div className="text-center py-12 text-zinc-500 bg-zinc-900/30 rounded-lg border border-white/5">
              Este usuario aún no ha publicado nada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
