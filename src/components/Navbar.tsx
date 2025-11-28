import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-medium tracking-tight text-lg flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
          SYNC
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-white transition-colors duration-200">
            Manifiesto
          </a>
          <a href="#community" className="hover:text-white transition-colors duration-200">
            Comunidad
          </a>
          <a href="#safety" className="hover:text-white transition-colors duration-200">
            Privacidad
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-white transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/register" className="text-xs font-medium bg-white text-black px-4 py-1.5 rounded-full hover:bg-zinc-200 transition-colors">
            Unirse a la beta
          </Link>
        </div>
      </div>
    </nav>
  );
}
