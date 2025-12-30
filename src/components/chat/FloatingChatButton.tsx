"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

export function FloatingChatButton() {
  return (
    <Link
      href="/messages"
      className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Mensajes"
    >
      <MessageSquare className="w-6 h-6" />
      <span className="absolute right-full mr-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Mensajes
      </span>
    </Link>
  );
}
