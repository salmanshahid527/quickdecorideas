"use client";

import { useQuery } from "@tanstack/react-query";
import type { Post } from "@/lib/wp/types";
import { fetchSearchPosts } from "@/lib/wp/api";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: (): Promise<Post[]> => fetchSearchPosts(query),
    enabled: query.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
