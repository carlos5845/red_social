"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function searchUsers(query: string) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const supabase = await supabaseServer();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error("Error searching users:", error);
    return [];
  }

  return users;
}

export async function getProfileByUsername(username: string) {
  const supabase = await supabaseServer();

  // Decode username just in case
  const decodedUsername = decodeURIComponent(username);
  console.log("Fetching profile for:", decodedUsername);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", decodedUsername)
    .single();

  if (error) {
    console.error("Error fetching profile for", decodedUsername, ":", JSON.stringify(error, null, 2));
    return null;
  }

  return profile;
}
