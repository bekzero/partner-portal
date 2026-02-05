"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Megaphone, Building2 } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  title: string;
  type: "battleCard" | "announcement" | "industry";
  subtitle?: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
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
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(search, 150);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    
    switch (result.type) {
      case "battleCard":
        router.push(`/app/battle-cards/${result.id}`);
        break;
      case "announcement":
        router.push(`/app/announcements/${result.id}`);
        break;
      case "industry":
        router.push(`/app/industries?industry=${encodeURIComponent(result.title)}`);
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "battleCard":
        return <FileText className="h-4 w-4 text-kzOrange" />;
      case "announcement":
        return <Megaphone className="h-4 w-4 text-blue-400" />;
      case "industry":
        return <Building2 className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "battleCard":
        return "Battle Card";
      case "announcement":
        return "Announcement";
      case "industry":
        return "Industry";
      default:
        return type;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-lg border-zinc-800/60 bg-zinc-950/50 text-sm font-normal text-zinc-400 shadow-none hover:bg-zinc-800/50 hover:text-zinc-100 md:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 text-zinc-500" />
        Search...
        <kbd className="pointer-events-none absolute right-2 top-1.5 hidden h-6 select-none items-center gap-1 rounded border border-zinc-800/60 bg-zinc-950 px-1.5 font-mono text-xs font-medium text-zinc-500 opacity-100 sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search battle cards, announcements, industries..."
          value={query}
          onValueChange={setQuery}
          className="text-zinc-100"
        />
        <CommandList className="max-h-[400px]">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            </div>
          )}
          
          {!loading && query.trim() && results.length === 0 && (
            <CommandEmpty className="py-6 text-center text-sm text-zinc-500">
              No results found for &quot;{query}&quot;
            </CommandEmpty>
          )}

          {!loading && results.length > 0 && (
            <CommandGroup heading="Results" className="text-zinc-500">
              {results.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => handleSelect(result)}
                  className="cursor-pointer text-zinc-300 aria-selected:bg-zinc-800/50 aria-selected:text-zinc-100"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(result.type)}
                    <div className="flex flex-col">
                      <span className="text-sm">{result.title}</span>
                      {result.subtitle && (
                        <span className="text-xs text-zinc-500">{result.subtitle}</span>
                      )}
                    </div>
                    <span className="ml-auto text-xs text-zinc-600">
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!loading && !query.trim() && (
            <div className="py-6 text-center text-sm text-zinc-500">
              Type to search across battle cards, announcements, and industries
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
