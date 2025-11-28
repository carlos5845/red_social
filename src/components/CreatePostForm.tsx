import { CreatePostDialog } from "./CreatePostDialog";

export function CreatePostForm({ userAvatar }: { userAvatar?: string | null }) {
  return (
    <CreatePostDialog userAvatar={userAvatar}>
      <div className="border border-white/5 rounded-xl p-4 bg-zinc-900/50 backdrop-blur-sm mb-6 cursor-pointer hover:bg-zinc-900/70 transition-colors">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="w-full bg-transparent text-zinc-500 text-lg mb-4 pt-2">
              ¿Qué está pasando?
            </div>
            <div className="flex justify-end">
              <div className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-full h-auto">
                Publicar
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreatePostDialog>
  );
}
