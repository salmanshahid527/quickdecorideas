"use client";

import { useQuery } from "@tanstack/react-query";
import type { Post } from "@/lib/wp/types";
import { fetchPosts } from "@/lib/wp/api";
import { wpKeys } from "./keys";

export type UsePostsParams = {
  perPage?: number;
  page?: number;
  categoryId?: number;
  sticky?: boolean;
};

export function usePosts(params?: UsePostsParams, initialData?: Post[]) {
  return useQuery({
    queryKey: wpKeys.posts(params ?? {}),
    queryFn: () => fetchPosts(params),
    initialData,
  });
}

