"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { searchUsers } from "@/app/actions/profile";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const users = await searchUsers(query);
      setResults(users || []);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (username: string) => {
    setOpen(false);
    router.push(`/profile/${username}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white"
        onClick={() => setOpen(true)}
      >
        <Search className="w-5 h-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Buscar usuarios..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Usuarios">
              {results.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.username}
                  onSelect={() => handleSelect(user.username)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.full_name || user.username}</span>
                      <span className="text-xs text-zinc-500">@{user.username}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
