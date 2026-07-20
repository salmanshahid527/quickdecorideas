import { getPageBySlug, getPostBySlug } from "@/lib/wp/server";

export const revalidate = 43200;

type Props = { params: Promise<{ slug: string }> };

export default async function Head({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (page) return null;
  const post = await getPostBySlug(slug);
  const hero = post?.featuredImage?.url;
  return hero ? <link rel="preload" as="image" href={hero} /> : null;
}
