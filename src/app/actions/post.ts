"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const content = formData.get("content") as string;
  const imageFile = formData.get("image") as File;

  if ((!content || content.trim().length === 0) && !imageFile) {
    return { error: "El contenido no puede estar vacío" };
  }

  // 1. Create Post
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (postError) {
    return { error: postError.message };
  }

  // 2. Upload Image if exists
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `post_${postData.id}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("post_images")
      .upload(filePath, imageFile);

    if (uploadError) {
      // Optional: Delete post if upload fails? For now just return error
      return { error: "Error al subir la imagen: " + uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("post_images").getPublicUrl(filePath);

    // 3. Link Image to Post
    const { error: imageError } = await supabase.from("post_images").insert({
      post_id: postData.id,
      image_url: publicUrl,
    });

    if (imageError) {
      return { error: imageError.message };
    }
  }

  revalidatePath("/inicio");
  return { success: true };
}

export async function getPosts() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        username,
        full_name,
        avatar_url
      ),
      post_images (
        image_url
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  let likedPostIds: number[] = [];
  if (user) {
    const { data: likes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id);
    likedPostIds = likes?.map((l: any) => l.post_id) || [];
  }

  return posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.includes(post.id),
  }));
}

export async function getPostById(id: number) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        username,
        full_name,
        avatar_url
      ),
      post_images (
        image_url
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  let isLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .single();
    isLiked = !!like;
  }

  return { ...post, isLiked };
}

export async function toggleLike(postId: number) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existingLike) {
    await supabase.from("post_likes").delete().eq("id", existingLike.id);
    return { liked: false };
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    return { liked: true };
  }
}

export async function sharePost(postId: number) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("shares")
    .insert({ post_id: postId, user_id: user.id });

  if (error) {
    // Ignore duplicate share error
    if (error.code === '23505') return { success: true };
    return { error: error.message };
  }

  return { success: true };
}
