"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { getOrCreateChat } from "@/app/actions/chat";

interface MessageButtonProps {
  targetUserId: string;
}

export function MessageButton({ targetUserId }: MessageButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleMessage() {
    setIsLoading(true);
    const result = await getOrCreateChat(targetUserId);

    if (result.chatId) {
      router.push(`/messages?chat=${result.chatId}`);
    } else if (result.error) {
      alert("Error al iniciar chat: " + result.error);
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleMessage}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
    >
      <MessageSquare className="w-4 h-4" />
      <span>{isLoading ? "Cargando..." : "Mensaje"}</span>
    </button>
  );
}
