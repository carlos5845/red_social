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
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
                post.id === payload.new.id
                  ? { ...post, ...payload.new }
                  : post
              )
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
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
