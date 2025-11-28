"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createPost } from "@/app/actions/post";
import { Image, X } from "lucide-react";

interface CreatePostDialogProps {
  children: React.ReactNode;
  userAvatar?: string | null;
}

export function CreatePostDialog({ children, userAvatar }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await createPost(formData);
    setLoading(false);
    setOpen(false);
    setPreview(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  function removeImage() {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-black border-white/10 text-white p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="sr-only">Crear Post</DialogTitle>
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10 -ml-2"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="font-bold text-blue-500"></div>
          </div>
        </DialogHeader>
        
        <form action={handleSubmit} className="p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 pt-1">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600" />
              )}
            </div>
            <div className="flex-1">
              <textarea
                name="content"
                placeholder="¿Qué está pasando?"
                className="w-full bg-transparent text-xl text-white placeholder-zinc-500 border-none focus:ring-0 resize-none min-h-[150px] p-0"
                autoFocus
              />
              
              {preview && (
                <div className="relative mt-4 mb-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-2xl max-h-[400px] w-full object-cover border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="border-t border-white/10 pt-4 flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <input
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:bg-blue-500/10 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 font-bold"
                >
                  {loading ? "Posteando..." : "Postear"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
