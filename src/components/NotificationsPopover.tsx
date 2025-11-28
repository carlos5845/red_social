"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationItem } from "./NotificationItem";

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    getUser();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications
    async function fetchNotifications() {
      const { data } = await supabase
        .from("notifications")
        .select(`
          *,
          profiles:actor_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    }

    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          // Fetch full notification data
          const { data: newNotification } = await supabase
            .from("notifications")
            .select(`
              *,
              profiles:actor_id (
                username,
                full_name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (newNotification) {
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  async function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      // Mark all as read locally
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);

      // Mark as read in DB
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white"
          >
            <Heart className={`w-5 h-5 ${unreadCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-zinc-950 border-white/10 text-zinc-200 max-h-[400px] overflow-y-auto">
        <div className="p-4 border-b border-white/5">
          <h4 className="font-semibold text-white">Notificaciones</h4>
        </div>
        <div className="divide-y divide-white/5">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No tienes notificaciones nuevas
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
