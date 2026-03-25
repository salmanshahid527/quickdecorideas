import sanitizeHtmlLib from "sanitize-html";

const defaultAllowedTags = sanitizeHtmlLib.defaults.allowedTags;

// WordPress content often includes many presentational tags; keep a permissive-but-safe allowlist.
const allowedTags = Array.from(
  new Set([
    ...defaultAllowedTags,
    "img",
    "figure",
    "figcaption",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "div",
    "span",
    "pre",
    "code",
    "blockquote",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ]),
);

export function sanitizeHtml(input: string | undefined | null): string {
  if (!input) return "";

  try {
    return sanitizeHtmlLib(input, {
      allowedTags,
      allowedAttributes: {
        a: ["href", "name", "target", "rel", "class"],
        img: ["src", "alt", "title", "width", "height", "loading", "decoding", "class", "srcset", "sizes"],
        "*": ["class"],
      },
      allowedSchemes: ["http", "https", "mailto"],
      // Disallow all "style" attributes and event handlers.
      allowedSchemesAppliedToAttributes: ["href", "src"],
    });
  } catch {
    return "";
  }
}
