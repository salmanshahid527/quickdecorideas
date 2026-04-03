"use client";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 mt-12">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
        <p className="text-[var(--muted)]">Common questions about this topic</p>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0"
          >
            <h3 className="font-semibold text-base mb-2">
              {index + 1}. {item.question}
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
