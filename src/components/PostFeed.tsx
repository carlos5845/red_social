"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { PostCard } from "./PostCard";
import { getPostById } from "@/app/actions/post";

interface PostFeedProps {
  initialPosts: any[];
}

export function PostFeed({ initialPosts }: PostFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
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
      .channel("realtime posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newPostId = payload.new.id;
            const newPost = await getPostById(newPostId);
            if (newPost) {
              setPosts((currentPosts) => [newPost, ...currentPosts]);
            }
          } else if (payload.eventType === "UPDATE") {
            setPosts((currentPosts) =>
              currentPosts.map((post) =>
                post.id === payload.new.id ? { ...post, ...payload.new } : post
              )
            );
          } else if (payload.eventType === "DELETE") {
            setPosts((currentPosts) =>
              currentPosts.filter((post) => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId || undefined}
        />
      ))}
    </div>
  );
}
