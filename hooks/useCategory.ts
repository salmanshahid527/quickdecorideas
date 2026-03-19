"use client";

import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/lib/wp/types";
import { fetchCategoryBySlug } from "@/lib/wp/api";
import { wpKeys } from "./keys";

export function useCategory(slug: string, initialData?: Category | null) {
  return useQuery({
    queryKey: wpKeys.category(slug),
    queryFn: () => fetchCategoryBySlug(slug),
    initialData,
  });
}

