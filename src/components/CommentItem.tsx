import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface CommentItemProps {
  comment: {
    id: number;
    content: string;
    created_at: string;
    profiles: {
      username: string;
      full_name: string;
      avatar_url: string | null;
    };
  };
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-3">
      <div className="flex-shrink-0">
        {comment.profiles.avatar_url ? (
          <img
            src={comment.profiles.avatar_url}
            alt={comment.profiles.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
            {comment.profiles.username[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">
            {comment.profiles.full_name || comment.profiles.username}
          </span>
          <span className="text-xs text-zinc-500">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
          </span>
        </div>
        <p className="text-sm text-zinc-300">{comment.content}</p>
      </div>
    </div>
  );
}
