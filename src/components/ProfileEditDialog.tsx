"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, uploadAvatar } from "@/app/profile/actions";

interface ProfileEditDialogProps {
  profile: any;
}

export function ProfileEditDialog({ profile }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    // Handle avatar upload if present
    const avatarFile = formData.get("avatar") as File;
    if (avatarFile && avatarFile.size > 0) {
      await uploadAvatar(formData);
    }

    // Update profile info
    await updateProfile(formData);
    
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Perfil</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Realiza cambios en tu perfil aquí. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right text-zinc-400">
              Avatar
            </Label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              className="col-span-3 bg-zinc-900 border-white/10 text-white file:text-white file:bg-zinc-800 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2 file:text-xs"
            />
            <div className="col-start-2 col-span-3 text-xs text-zinc-500">
              Formatos soportados: JPG, PNG, GIF (Máx. 5MB)
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right text-zinc-400">
              Nombre
            </Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile?.full_name}
              className="col-span-3 bg-zinc-900 border-white/10 text-white focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right text-zinc-400">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile?.bio}
              className="col-span-3 bg-zinc-900 border-white/10 text-white focus:border-indigo-500"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-indigo-600 text-white hover:bg-indigo-700">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
