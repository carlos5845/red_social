import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import Link from "next/link";

interface NotificationItemProps {
  notification: {
    id: number;
    type: "like" | "comment" | "follow";
    created_at: string;
    is_read: boolean;
    profiles: {
      username: string;
      full_name: string;
      avatar_url: string | null;
    };
    entity_id: number;
  };
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const iconMap = {
    like: <Heart className="w-4 h-4 text-red-500 fill-red-500" />,
    comment: <MessageCircle className="w-4 h-4 text-blue-500 fill-blue-500" />,
    follow: <UserPlus className="w-4 h-4 text-green-500" />,
  };

  const textMap = {
    like: "le gustó tu post",
    comment: "comentó en tu post",
    follow: "comenzó a seguirte",
  };

  const linkMap = {
    like: `/post/${notification.entity_id}`,
    comment: `/post/${notification.entity_id}`,
    follow: `/profile/${notification.profiles.username}`,
  };

  return (
    <Link 
      href={linkMap[notification.type]} 
      className={`flex items-start gap-3 p-3 hover:bg-white/5 transition-colors ${!notification.is_read ? "bg-white/5" : ""}`}
    >
      <div className="flex-shrink-0 relative">
        {notification.profiles.avatar_url ? (
          <img
            src={notification.profiles.avatar_url}
            alt={notification.profiles.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
            {notification.profiles.username[0].toUpperCase()}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-1 border border-zinc-900">
          {iconMap[notification.type]}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200">
          <span className="font-semibold text-white">
            {notification.profiles.full_name || notification.profiles.username}
          </span>{" "}
          {textMap[notification.type]}
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}
        </p>
      </div>
      {!notification.is_read && (
        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
      )}
    </Link>
  );
}
