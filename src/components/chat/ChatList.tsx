"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface ChatListProps {
  conversations: any[]; // Using any for now to match action return type
  selectedChatId?: number;
}

export function ChatList({ conversations, selectedChatId }: ChatListProps) {
  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border-r border-white/5">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-white font-semibold">
          <MessageSquare className="w-5 h-5" />
          <span>Mensajes</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-sm">
            No tienes conversaciones.
          </div>
        ) : (
          <div className="flex flex-col">
            {conversations.map((chat) => (
              <Link
                key={chat.id}
                href={`/messages?chat=${chat.id}`}
                className={`p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                  selectedChatId === chat.id
                    ? "bg-white/5 border-l-2 border-white"
                    : "border-l-2 border-transparent"
                }`}
              >
                {chat.otherUser?.avatarUrl ? (
                  <img
                    src={chat.otherUser.avatarUrl}
                    alt={chat.otherUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold">
                    {chat.otherUser?.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-zinc-200 truncate">
                      {chat.otherUser?.fullName || chat.otherUser?.username}
                    </span>
                    {chat.lastMessageAt && (
                      <span className="text-xs text-zinc-500">
                        {new Date(chat.lastMessageAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 truncate">
                    {chat.lastMessage || "Iniciar conversación"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
