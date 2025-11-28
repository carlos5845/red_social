"use client";

import { useEffect, useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { createComment, getComments } from "@/app/actions/post";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { LoginPromptDialog } from "./LoginPromptDialog";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch initial comments
  useEffect(() => {
    getComments(postId).then(setComments);
  }, [postId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`realtime comments ${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          // Fetch the full comment with profile to display
          const { data: newComment } = await supabase
            .from("comments")
            .select(`
              *,
              profiles (
                username,
                full_name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (newComment) {
            setComments((prev) => [...prev, newComment]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const result = await createComment(postId, content);
    setLoading(false);

    if (result?.error === "No autorizado") {
      setShowLoginDialog(true);
    } else if (result?.success) {
      setContent("");
    }
  }

  return (
    <div className="mt-6 border-t border-white/5 pt-6">
      <h3 className="text-lg font-semibold text-white mb-4">Comentarios</h3>
      
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-4">
            No hay comentarios aún. ¡Sé el primero!
          </p>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe un comentario..."
          className="bg-zinc-900 border-white/10 text-white min-h-[40px] resize-none"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={loading || !content.trim()}
          className="bg-white text-black hover:bg-zinc-200"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <LoginPromptDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
      />
    </div>
  );
}
