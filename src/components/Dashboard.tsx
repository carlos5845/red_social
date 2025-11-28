"use client";

import { Search, MoreHorizontal } from "lucide-react";
import { CreatePostForm } from "./CreatePostForm";
import { PostCard } from "./PostCard";
import { PostFeed } from "./PostFeed";

interface DashboardProps {
  posts: any[];
  userAvatar?: string | null;
}

export function Dashboard({ posts, userAvatar }: DashboardProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-400">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - Hidden on mobile, handled by AuthNavbar */}
          <div className="hidden md:flex flex-col gap-4 border-r border-white/5 pr-4 h-fit sticky top-24">
            {/* Sidebar content managed by AuthNavbar/Layout, this is just for spacing/structure if needed */}
          </div>

          {/* Feed */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Create Post */}
            <CreatePostForm userAvatar={userAvatar} />

            {/* Feed */}
            <PostFeed initialPosts={posts} />
          </div>

          {/* Widget */}
          <div className="hidden md:flex flex-col gap-6">
            <div className="border border-white/5 rounded-xl p-5 bg-zinc-900/50 sticky top-24">
              <h3 className="text-sm font-semibold text-white mb-4">
                Tendencias
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center group cursor-pointer">
                    <span className="text-sm text-zinc-400 group-hover:text-indigo-400 transition-colors">
                      #Tendencia{i}
                    </span>
                    <span className="text-xs text-zinc-600">2.4k posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
