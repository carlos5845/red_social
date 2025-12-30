"use client";

import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toggleLike, deletePost } from "@/app/actions/post";
import { cn } from "@/lib/utils";
import { ShareDialog } from "./ShareDialog";
import { LoginPromptDialog } from "./LoginPromptDialog";
import Link from "next/link";

interface PostCardProps {
  post: {
    id: number;
    user_id: string;
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
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [sharesCount, setSharesCount] = useState(post.shares_count || 0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const isOwner = currentUserId === post.user_id;

  // Sync local state with realtime updates from props
  useEffect(() => {
    setLikesCount(post.likes_count);
    setSharesCount(post.shares_count || 0);
  }, [post.likes_count, post.shares_count]);

  async function handleLike() {
    // Optimistic update
    const previousLiked = liked;
    const previousLikesCount = likesCount;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

    const result = await toggleLike(post.id);

    if (result?.error === "No autorizado") {
      // Revert optimistic update
      setLiked(previousLiked);
      setLikesCount(previousLikesCount);
      setShowLoginDialog(true);
    }
  }

  function handleShareSuccess() {
    setSharesCount((prev) => prev + 1);
  }

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deletePost(post.id);
    setIsDeleting(false);

    if (result?.success) {
      // Optimistic: hide the post immediately
      setIsHidden(true);
      setShowDeleteConfirm(false);
    } else if (result?.error) {
      alert("Error al eliminar: " + result.error);
    }
  }

  // Don't render if hidden (deleted)
  if (isHidden) return null;

  return (
    <div className="border border-white/5 rounded-lg p-4 space-y-3 mb-4 bg-zinc-900/30">
      <div className="flex items-center gap-3 justify-between">
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

        {/* Delete button - visible only to owner */}
        {isOwner && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-zinc-600 hover:text-red-500 transition-colors p-1"
            title="Eliminar post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
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
              liked
                ? "text-red-500 fill-red-500"
                : "text-zinc-600 group-hover:text-red-500"
            )}
          />
          <span
            className={cn(
              "text-xs transition-colors",
              liked ? "text-red-500" : "text-zinc-600 group-hover:text-red-500"
            )}
          >
            {likesCount}
          </span>
        </button>

        <Link
          href={`/post/${post.id}`}
          className="flex items-center gap-1 group cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
          <span className="text-xs text-zinc-600 group-hover:text-white transition-colors">
            {post.comments_count || 0}
          </span>
        </Link>

        <ShareDialog postId={post.id} onShare={handleShareSuccess}>
          <button className="flex items-center gap-1 group cursor-pointer focus:outline-none">
            <Share2 className="w-4 h-4 text-zinc-600 group-hover:text-green-500 transition-colors" />
            <span className="text-xs text-zinc-600 group-hover:text-green-500 transition-colors">
              {sharesCount}
            </span>
          </button>
        </ShareDialog>
      </div>

      <LoginPromptDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              ¿Eliminar publicación?
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
