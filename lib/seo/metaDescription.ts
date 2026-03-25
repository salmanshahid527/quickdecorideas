/** Strip tags / collapse whitespace for meta description (excerpt HTML from WordPress). */
export function metaDescriptionFromHtml(html: string | undefined | null, max = 155): string | undefined {
  if (!html?.trim()) return undefined;
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  if (!text) return undefined;
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
