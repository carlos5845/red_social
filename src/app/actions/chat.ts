"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Utility to get Supabase server client
async function _getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export async function getConversations() {
  const supabase = await _getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Get chats where the user is a member
  // We need to join with chat_members to filter, and also get the *other* member info for DM display
  const { data, error } = await supabase
    .from("chat_members")
    .select(`
      chat_id,
      chats (
        id,
        created_at,
        last_message_content,
        last_message_at,
        chat_members (
          user_id,
          profiles (
            username,
            full_name,
            avatar_url
          )
        )
      )
    `)
    .eq("user_id", user.id)
    .order("last_message_at", { ascending: false, foreignTable: "chats" });

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  // Format data for easier consumption
  return data.map((item: any) => {
    const chat = item.chats;
    // Find the "other" participant for DM
    const otherMember = chat.chat_members.find((m: any) => m.user_id !== user.id);
    const otherProfile = otherMember?.profiles;

    return {
      id: chat.id,
      lastMessage: chat.last_message_content,
      lastMessageAt: chat.last_message_at,
      otherUser: otherProfile ? {
        username: otherProfile.username,
        fullName: otherProfile.full_name,
        avatarUrl: otherProfile.avatar_url,
      } : null
    };
  });
}

export async function getChatMessages(chatId: number) {
  const supabase = await _getSupabase();
  
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      created_at,
      sender_id,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data;
}

export async function sendMessage(chatId: number, content: string) {
  const supabase = await _getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  // 1. Insert message
  const { error: msgError } = await supabase
    .from("messages")
    .insert({
      chat_id: chatId,
      sender_id: user.id,
      content: content.trim()
    });

  if (msgError) return { error: msgError.message };

  // 2. Update chat's last_message
  const { error: chatError } = await supabase
    .from("chats")
    .update({
      last_message_content: content.trim(),
      last_message_at: new Date().toISOString()
    })
    .eq("id", chatId);

  if (chatError) console.error("Error updating chat:", chatError);

  return { success: true };
}

export async function getOrCreateChat(targetUserId: string) {
  const supabase = await _getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  // 1. Check if a DM already exists between these two users
  // This is a bit complex in SQL via Supabase client, so we might need a stored procedure
  // Or simply fetch all user's chats and check members.
  // For simplicity and standard RLS usage:
  
  // Get all chat IDs the current user is in
  const { data: myChats } = await supabase
    .from("chat_members")
    .select("chat_id")
    .eq("user_id", user.id);

  if (myChats && myChats.length > 0) {
    const chatIds = myChats.map(c => c.chat_id);
    
    // Check if the target user is in any of these chats
    // AND the chat type is 'dm' (checks if it's a direct message)
    const { data: existingChat } = await supabase
      .from("chat_members")
      .select("chat_id, chats!inner(type)") // !inner to ensure we filter by chat type
      .in("chat_id", chatIds)
      .eq("user_id", targetUserId)
      .eq("chats.type", "dm") 
      .maybeSingle();

    if (existingChat) {
      return { chatId: existingChat.chat_id };
    }
  }

  // 2. Create new DM using RPC to avoid RLS issues
  const { data: chatId, error: createError } = await supabase
    .rpc('create_dm', { target_user_id: targetUserId });

  if (createError) return { error: createError.message };

  return { chatId };
}
