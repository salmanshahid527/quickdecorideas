"use client";

import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/lib/wp/types";
import { fetchCategories } from "@/lib/wp/api";
import { wpKeys } from "./keys";

export function useCategories(initialData?: Category[]) {
  return useQuery({
    queryKey: wpKeys.categories,
    queryFn: fetchCategories,
    initialData,
  });
}

