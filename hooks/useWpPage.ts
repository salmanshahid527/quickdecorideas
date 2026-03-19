"use client";

import { useQuery } from "@tanstack/react-query";
import type { Page } from "@/lib/wp/types";
import { fetchPageBySlug } from "@/lib/wp/api";
import { wpKeys } from "./keys";

export function useWpPage(slug: string, initialData?: Page | null) {
  return useQuery({
    queryKey: wpKeys.page(slug),
    queryFn: () => fetchPageBySlug(slug),
    initialData,
  });
}

