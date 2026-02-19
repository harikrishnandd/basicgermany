'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * FAQ Accordion Component with SEO Schema
 * Displays collapsible FAQ items from Firestore with automatic FAQPage schema generation
 * Optimized for Google's "People Also Ask" rich results
 */
export default function FAQSection({ faqs, articleTitle }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* FAQ Schema for SEO - Critical for "People Also Ask" rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section id="faq" className="faq-section">
        <h2 className="faq-heading">
          Frequently Asked Questions about {articleTitle}
        </h2>

        <div className="faq-accordion">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="faq-question-button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <ChevronDown
                    className={`faq-icon ${isOpen ? 'faq-icon-open' : ''}`}
                    size={20}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`faq-answer ${isOpen ? 'faq-answer-open' : ''}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <div className="faq-answer-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <style jsx>{`
          .faq-section {
            margin: 3rem 0;
            padding: 2rem;
            background: var(--systemSecondaryBackground, #f9fafb);
            border-radius: 12px;
          }

          .faq-heading {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--systemPrimary, #1a1a1a);
            margin-bottom: 1.5rem;
            line-height: 1.3;
          }

          .faq-accordion {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .faq-item {
            background: var(--systemBackground, #ffffff);
            border: 1px solid var(--systemBorder, #e5e7eb);
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.2s ease;
          }

          .faq-item:hover {
            border-color: var(--systemPrimary, #007AFF);
            box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
          }

          .faq-item-open {
            border-color: var(--systemPrimary, #007AFF);
          }

          .faq-question-button {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 1.25rem 1.5rem;
            background: transparent;
            border: none;
            text-align: left;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .faq-question-button:hover {
            background: var(--systemSecondaryBackground, #f9fafb);
          }

          .faq-question-text {
            font-size: 1.0625rem;
            font-weight: 600;
            color: var(--systemPrimary, #1a1a1a);
            line-height: 1.5;
            flex: 1;
          }

          .faq-icon {
            flex-shrink: 0;
            color: var(--systemSecondary, #666);
            transition: transform 0.3s ease, color 0.2s ease;
          }

          .faq-icon-open {
            transform: rotate(180deg);
            color: var(--systemPrimary, #007AFF);
          }

          .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
          }

          .faq-answer-open {
            max-height: 1000px;
            padding: 0 1.5rem 1.25rem 1.5rem;
          }

          .faq-answer-content {
            font-size: 1rem;
            line-height: 1.7;
            color: var(--systemSecondary, #4a5568);
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          /* Mobile responsive */
          @media (max-width: 768px) {
            .faq-section {
              padding: 1.5rem;
              margin: 2rem 0;
            }

            .faq-heading {
              font-size: 1.5rem;
            }

            .faq-question-button {
              padding: 1rem;
            }

            .faq-question-text {
              font-size: 1rem;
            }

            .faq-answer-open {
              padding: 0 1rem 1rem 1rem;
            }

            .faq-answer-content {
              font-size: 0.9375rem;
            }
          }

          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .faq-section {
              background: var(--systemSecondaryBackground, #1c1c1e);
            }

            .faq-item {
              background: var(--systemBackground, #2c2c2e);
              border-color: var(--systemBorder, #38383a);
            }

            .faq-item:hover {
              border-color: var(--systemPrimary, #0A84FF);
              box-shadow: 0 2px 8px rgba(10, 132, 255, 0.2);
            }

            .faq-item-open {
              border-color: var(--systemPrimary, #0A84FF);
            }

            .faq-question-button:hover {
              background: var(--systemTertiaryBackground, #3a3a3c);
            }

            .faq-heading {
              color: var(--systemPrimary, #ffffff);
            }

            .faq-question-text {
              color: var(--systemPrimary, #ffffff);
            }

            .faq-answer-content {
              color: var(--systemSecondary, #a0a0a0);
            }

            .faq-icon {
              color: var(--systemSecondary, #a0a0a0);
            }

            .faq-icon-open {
              color: var(--systemPrimary, #0A84FF);
            }
          }

          /* Accessibility: Focus states */
          .faq-question-button:focus {
            outline: 2px solid var(--systemPrimary, #007AFF);
            outline-offset: 2px;
          }

          /* Print styles */
          @media print {
            .faq-answer {
              max-height: none !important;
              padding: 0 1.5rem 1.25rem 1.5rem !important;
            }

            .faq-icon {
              display: none;
            }
          }
        `}</style>
      </section>
    </>
  );
}
