"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/app/auth/actions";

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginPromptDialog({ open, onOpenChange }: LoginPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inicia sesión para interactuar</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Necesitas una cuenta para dar like, comentar y compartir posts.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <form action={async () => { await signInWithGoogle() }}>
            <Button type="submit" variant="default" className="w-full bg-white text-black hover:bg-zinc-200">
              Continuar con Google
            </Button>
          </form>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
