"use client";

import { Home, Plus, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/auth/actions";
import { CreatePostDialog } from "./CreatePostDialog";
import { NotificationsPopover } from "./NotificationsPopover";
import { SearchDialog } from "./SearchDialog";

interface AuthNavbarProps {
  userAvatar?: string | null;
}

export function AuthNavbar({ userAvatar }: AuthNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-black border-b border-white/5 flex items-center justify-between px-6 z-50">
      {/* Logo */}
      <Link
        href="/inicio"
        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 transition-colors"
      >
        <span className="text-lg font-bold text-white">S</span>
      </Link>

      {/* Navigation Icons */}
      <div className="flex gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white"
        >
          <Link href="/inicio">
          <Home className="w-5 h-5" />
          </Link>
        </Button>

        <SearchDialog />

        <CreatePostDialog userAvatar={userAvatar}>
          <Button
            variant="default"
            size="icon"
            className="w-10 h-10 rounded-xl bg-white text-black hover:bg-zinc-200"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </CreatePostDialog>

        <NotificationsPopover />

        <Link href="/profile">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white"
          >
            <User className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Menu at right */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-zinc-200">
          <DropdownMenuItem
            className="focus:bg-white/10 focus:text-white cursor-pointer text-red-400 focus:text-red-400"
            onClick={async () => {
              await signOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
