/** Strip all HTML tags */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Extract FAQ items from HTML content (expects h3 tags followed by p tags).
 * Returns array of {question, answer} pairs.
 */
export function extractFAQFromHtml(html: string): Array<{ question: string; answer: string }> {
  const faqItems: Array<{ question: string; answer: string }> = [];
  
  // Match patterns like: <h3>Question?</h3><p>Answer text.</p>
  const h3Pattern = /<h3[^>]*>([^<]+)<\/h3>/gi;
  const pPattern = /<p[^>]*>([^<]+)<\/p>/gi;
  
  // Find all h3 and p tags
  const h3Matches = Array.from(html.matchAll(h3Pattern)).map(m => ({
    text: stripHtml(m[1]),
    index: m.index || 0
  }));
  
  const pMatches = Array.from(html.matchAll(pPattern)).map(m => ({
    text: stripHtml(m[1]),
    index: m.index || 0
  }));
  
  // Pair h3 (questions) with following p (answers)
  for (let i = 0; i < h3Matches.length; i++) {
    const question = h3Matches[i];
    // Find the next p tag that comes after this h3
    const nextP = pMatches.find(p => p.index > question.index);
    
    if (nextP && question.text && nextP.text) {
      faqItems.push({
        question: question.text,
        answer: nextP.text
      });
    }
  }
  
  return faqItems;
}
