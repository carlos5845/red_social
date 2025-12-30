import { Suspense } from "react";
import { getConversations, getChatMessages } from "@/app/actions/chat";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface MessagesPageProps {
  searchParams: Promise<{
    chat?: string;
  }>;
}

export default async function MessagesPage({
  searchParams,
}: MessagesPageProps) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?login=true");
  }

  // Fetch conversations
  const conversations = await getConversations();
  const { chat: chatIdParam } = await searchParams;
  const selectedChatId = chatIdParam ? parseInt(chatIdParam) : undefined;

  // If a chat is selected, fetch its details/messages
  let initialMessages: any[] = [];
  let recipient = null;

  if (selectedChatId) {
    // Check if user belongs to this chat
    const selectedChat = conversations.find(
      (c: any) => c.id === selectedChatId
    );
    if (selectedChat) {
      initialMessages = await getChatMessages(selectedChatId);
      recipient = selectedChat.otherUser;
    }
  }

  // Pass a serialized user object to client components
  const currentUser = {
    id: user.id,
    username: user.user_metadata?.username,
    avatar_url: user.user_metadata?.avatar_url,
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 pt-20">
      <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex">
        {/* Chat List - Sidebar */}
        <div
          className={`w-full md:w-80 flex-shrink-0 ${
            selectedChatId ? "hidden md:flex" : "flex"
          }`}
        >
          <ChatList
            conversations={conversations}
            selectedChatId={selectedChatId}
          />
        </div>

        {/* Chat Window - Main Area */}
        <div
          className={`flex-1 flex flex-col ${
            !selectedChatId ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedChatId && recipient ? (
            <ChatWindow
              chatId={selectedChatId}
              currentUser={currentUser}
              recipient={recipient}
              initialMessages={initialMessages}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/50">
              <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 opacity-50"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p>Selecciona una conversación para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
