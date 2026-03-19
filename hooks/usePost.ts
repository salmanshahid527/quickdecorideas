"use client";

import { useQuery } from "@tanstack/react-query";
import type { Post } from "@/lib/wp/types";
import { fetchPostBySlug } from "@/lib/wp/api";
import { wpKeys } from "./keys";

export function usePost(slug: string, initialData?: Post | null) {
  return useQuery({
    queryKey: wpKeys.post(slug),
    queryFn: () => fetchPostBySlug(slug),
    initialData,
  });
}

