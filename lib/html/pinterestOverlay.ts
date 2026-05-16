const PINTEREST_PROFILE_URL = "https://www.pinterest.com/quickdecorideas/";

const PINTEREST_ICON_PATH =
  "M12 0C5.372 0 0 5.373 0 12c0 5.084 3.163 9.406 7.622 11.095-.105-.945-.2-2.395.042-3.429.218-.936 1.404-5.964 1.404-5.964s-.358-.716-.358-1.775c0-1.662.964-2.902 2.165-2.902 1.02 0 1.512.767 1.512 1.684 0 1.026-.654 2.558-.99 3.981-.283 1.196.602 2.17 1.784 2.17 2.14 0 3.786-2.257 3.786-5.516 0-2.878-2.066-4.886-5.019-4.886-3.426 0-5.44 2.568-5.44 5.224 0 1.034.397 2.145.893 2.747.098.119.112.223.083.344-.09.374-.293 1.193-.331 1.361-.052.22-.17.268-.396.162-1.482-.687-2.406-2.843-2.406-4.58 0-3.731 2.71-7.159 7.814-7.159 4.096 0 7.281 2.92 7.281 6.811 0 4.063-2.561 7.337-6.11 7.337-1.194 0-2.316-.62-2.7-1.352l-.735 2.805c-.265 1.012-.985 2.283-1.467 3.057C9.72 23.947 10.847 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z";

const IMG_TAG_RE = /<img\b(?![^>]*\bdata-pin-overlay\b)[^>]*>/gi;

type Bounds = { start: number; end: number };

/** Wrap post body images with a Pinterest profile link (server-only; avoids hydration issues). */
export function addPinterestOverlaysToPostContentHtml(html: string): string {
  if (!html) return html;

  const matches = Array.from(html.matchAll(IMG_TAG_RE));
  if (matches.length === 0) return html;

  let output = html;

  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const imgTag = match[0];
    const imgIndex = match.index;
    if (imgIndex === undefined) continue;

    const bounds = findWrapBounds(output, imgIndex, imgTag.length);
    const innerHtml = output.slice(bounds.start, bounds.end);
    const markedInner = markImgWithPinOverlay(innerHtml);
    const wrap = buildPinWrapHtml(markedInner);

    output = output.slice(0, bounds.start) + wrap + output.slice(bounds.end);
  }

  return output;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function markImgWithPinOverlay(fragment: string): string {
  return fragment.replace(/<img\b/i, '<img data-pin-overlay="true"');
}

function findWrapBounds(html: string, imgIndex: number, imgLength: number): Bounds {
  const figure = findFigureBounds(html, imgIndex, imgLength);
  if (figure) return figure;

  const anchor = findAnchorBounds(html, imgIndex, imgLength);
  if (anchor) return anchor;

  return { start: imgIndex, end: imgIndex + imgLength };
}

function findFigureBounds(html: string, imgIndex: number, imgLength: number): Bounds | null {
  const before = html.slice(0, imgIndex);
  const start = before.lastIndexOf("<figure");
  if (start === -1) return null;

  const closeTag = "</figure>";
  const closeIdx = html.indexOf(closeTag, imgIndex + imgLength);
  if (closeIdx === -1) return null;

  return { start, end: closeIdx + closeTag.length };
}

function findAnchorBounds(html: string, imgIndex: number, imgLength: number): Bounds | null {
  const before = html.slice(0, imgIndex);
  const start = before.lastIndexOf("<a ");
  if (start === -1) return null;

  const between = html.slice(start, imgIndex);
  if (/<\/a>/i.test(between)) return null;

  const closeTag = "</a>";
  const closeIdx = html.indexOf(closeTag, imgIndex + imgLength);
  if (closeIdx === -1) return null;

  const end = closeIdx + closeTag.length;
  const inner = html.slice(start, end);
  if (!/<img\b/i.test(inner)) return null;

  return { start, end };
}

function buildPinWrapHtml(innerHtml: string): string {
  const pinHref = escapeAttr(PINTEREST_PROFILE_URL);

  return (
    `<div class="wp-image-pin-wrap group" data-wp-pinterest-wrap>` +
    innerHtml +
    `<a class="wp-pinterest-pin-btn" href="${pinHref}" target="_blank" rel="noopener noreferrer" aria-label="Open Pinterest">` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">` +
    `<path d="${PINTEREST_ICON_PATH}"/>` +
    `</svg></a></div>`
  );
}
