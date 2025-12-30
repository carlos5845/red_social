"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { getChatMessages, sendMessage } from "@/app/actions/chat";
import { createBrowserClient } from "@supabase/ssr";

interface ChatWindowProps {
  chatId: number;
  currentUser: any;
  recipient: any;
  initialMessages?: any[];
}

export function ChatWindow({
  chatId,
  currentUser,
  recipient,
  initialMessages = [],
}: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          // Ideally we would fetch the profile for the new message if needed,
          // but for basic display we might know who sent it based on sender_id
          const sender =
            newMsg.sender_id === currentUser.id ? currentUser : recipient;

          const formattedMsg = {
            id: newMsg.id,
            content: newMsg.content,
            created_at: newMsg.created_at,
            sender_id: newMsg.sender_id,
            profiles: {
              username: sender?.username || "Unknown",
              avatar_url: sender?.avatar_url,
            },
          };

          setMessages((prev) => [...prev, formattedMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, supabase, currentUser, recipient]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    // Optimistic update could go here, but let's rely on realtime/action return for now to be safe
    // Actually, let's do optimistic for better UX
    const optimisticMsg = {
      id: Date.now(), // temp id
      content: newMessage,
      created_at: new Date().toISOString(),
      sender_id: currentUser.id,
      profiles: {
        username: currentUser.username,
        avatar_url: currentUser.avatar_url,
      },
    };

    // setMessages(prev => [...prev, optimisticMsg]); // Optional: enable if realtime is slow
    const contentToSend = newMessage;
    setNewMessage("");

    const result = await sendMessage(chatId, contentToSend);
    if (result.error) {
      alert("Error enviando mensaje: " + result.error);
      // Optional: remove optimistic message if we added it
    }
    setIsSending(false);
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3">
        {recipient ? (
          <>
            {recipient.avatarUrl ? (
              <img
                src={recipient.avatarUrl}
                className="w-8 h-8 rounded-full bg-zinc-800 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                {recipient.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-white">
                {recipient.fullName || recipient.username}
              </h3>
              <p className="text-xs text-zinc-500">@{recipient.username}</p>
            </div>
          </>
        ) : (
          <div className="text-white">Chat</div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg: any) => {
          const isMine = msg.sender_id === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-zinc-800 text-zinc-200 rounded-tl-sm"
                }`}
              >
                <p>{msg.content}</p>
                <span
                  className={`text-[10px] block text-right mt-1 ${
                    isMine ? "text-blue-200" : "text-zinc-500"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
