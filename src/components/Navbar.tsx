import Link from "next/link";

import { LogIn } from "lucide-react";
export function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-medium tracking-tight text-lg flex items-center gap-2"
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
          SYNC
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="group flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 text-black transition-all hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            aria-label="Iniciar sesión"
          >
            <LogIn className="h-4 w-4" />
            <span className="text-xs font-bold tracking-wide">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
