"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { PostCard } from "./PostCard";
import { CommentSection } from "./CommentSection";

interface SinglePostViewProps {
  initialPost: any;
}

export function SinglePostView({ initialPost }: SinglePostViewProps) {
  const [post, setPost] = useState(initialPost);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime post ${post.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
          filter: `id=eq.${post.id}`,
        },
        (payload) => {
          setPost((currentPost: any) => ({
            ...currentPost,
            ...payload.new,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, post.id]);

  return (
    <div>
      <PostCard post={post} currentUserId={currentUserId || undefined} />
      <CommentSection postId={post.id} />
    </div>
  );
}
