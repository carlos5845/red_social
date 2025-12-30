"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteComment } from "@/app/actions/post";

interface CommentItemProps {
  comment: {
    id: number;
    user_id: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
      full_name: string;
      avatar_url: string | null;
    };
  };
  postId: number;
  currentUserId?: string;
}

export function CommentItem({
  comment,
  postId,
  currentUserId,
}: CommentItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const isOwner = currentUserId === comment.user_id;

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteComment(comment.id, postId);
    setIsDeleting(false);

    if (result?.success) {
      // Optimistic: hide the comment immediately
      setIsHidden(true);
      setShowDeleteConfirm(false);
    } else if (result?.error) {
      alert("Error al eliminar: " + result.error);
    }
  }

  // Don't render if hidden (deleted)
  if (isHidden) return null;

  return (
    <>
      <div className="flex gap-3 py-3">
        <div className="flex-shrink-0">
          {comment.profiles.avatar_url ? (
            <img
              src={comment.profiles.avatar_url}
              alt={comment.profiles.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
              {comment.profiles.username[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">
                {comment.profiles.full_name || comment.profiles.username}
              </span>
              <span className="text-xs text-zinc-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>

            {/* Delete button - visible only to owner */}
            {isOwner && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                title="Eliminar comentario"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className="text-sm text-zinc-300">{comment.content}</p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              ¿Eliminar comentario?
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
    </>
  );
}
