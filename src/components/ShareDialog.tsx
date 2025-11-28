"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { sharePost } from "@/app/actions/post";

interface ShareDialogProps {
  postId: number;
  children: React.ReactNode;
  onShare?: () => void;
}

export function ShareDialog({ postId, children, onShare }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/post/${postId}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Call server action to record share
      await sharePost(postId);
      
      // Notify parent to update UI count
      if (onShare) {
        onShare();
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Post</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              defaultValue={shareUrl}
              readOnly
              className="bg-zinc-800 border-white/10 text-zinc-300 focus-visible:ring-offset-0"
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copiar</span>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex justify-end mt-4">
            <Button variant="secondary" onClick={() => setOpen(false)}>
                Cerrar
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
