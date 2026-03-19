import { getPostBySlug } from "@/lib/wp/server";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export default async function Head({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { revalidate });
  const hero = post?.featuredImage?.url;

  return hero ? <link rel="preload" as="image" href={hero} /> : null;
}

