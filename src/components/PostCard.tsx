"use client";

import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toggleLike, sharePost } from "@/app/actions/post";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: number;
    content: string | null;
    created_at: string;
    likes_count: number;
    comments_count: number;
    shares_count?: number;
    isLiked?: boolean;
    profiles: {
      username: string;
      full_name: string;
      avatar_url: string | null;
    };
    post_images: {
      image_url: string;
    }[];
  };
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [sharesCount, setSharesCount] = useState(post.shares_count || 0);
  const [isSharing, setIsSharing] = useState(false);

  // Sync local state with realtime updates from props
  useEffect(() => {
    setLikesCount(post.likes_count);
    setSharesCount(post.shares_count || 0);
  }, [post.likes_count, post.shares_count]);

  async function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    await toggleLike(post.id);
  }

  async function handleShare() {
    if (isSharing) return;
    setIsSharing(true);
    setSharesCount((prev) => prev + 1);
    await sharePost(post.id);
    setIsSharing(false);
  }

  return (
    <div className="border border-white/5 rounded-lg p-4 space-y-3 mb-4 bg-zinc-900/30">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {post.profiles.avatar_url ? (
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
              {post.profiles.username[0].toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <div className="text-sm text-zinc-300 font-medium">
            {post.profiles.full_name || post.profiles.username}
          </div>
          <div className="text-xs text-zinc-600">
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="text-sm text-zinc-400 whitespace-pre-wrap">
        {post.content}
      </p>

      {post.post_images && post.post_images.length > 0 && (
        <div className="mt-3 rounded-lg overflow-hidden border border-white/5">
          <img
            src={post.post_images[0].image_url}
            alt="Post attachment"
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-white/5">
        <button 
          onClick={handleLike}
          className="flex items-center gap-1 group cursor-pointer focus:outline-none"
        >
          <Heart 
            className={cn(
              "w-4 h-4 transition-colors",
              liked ? "text-red-500 fill-red-500" : "text-zinc-600 group-hover:text-red-500"
            )} 
          />
          <span className={cn(
            "text-xs transition-colors",
            liked ? "text-red-500" : "text-zinc-600 group-hover:text-red-500"
          )}>
            {likesCount}
          </span>
        </button>

        <div className="flex items-center gap-1 group cursor-pointer">
          <MessageCircle className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
          <span className="text-xs text-zinc-600 group-hover:text-white transition-colors">{post.comments_count || 0}</span>
        </div>

        <button 
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-1 group cursor-pointer focus:outline-none disabled:opacity-50"
        >
          <Share2 className="w-4 h-4 text-zinc-600 group-hover:text-green-500 transition-colors" />
          <span className="text-xs text-zinc-600 group-hover:text-green-500 transition-colors">{sharesCount}</span>
        </button>
      </div>
    </div>
  );
}
