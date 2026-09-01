// ============================================================
// BRIDGE-AI Kenya - FAQ Model
// ============================================================

/**
 * Represents a Frequently Asked Question.
 * FAQs are used for farmers, students, SMEs, and other audiences.
 */
export interface FAQ {
  /** Unique identifier for the FAQ */
  id?: number;

  /** The question text */
  question: string;

  /** The answer text (HTML content) */
  answer: string;

  /** Target audience for this FAQ */
  audience: 'farmers' | 'students' | 'smes' | 'researchers' | 'developers' | 'general';

  /** Display order on the FAQ page */
  display_order?: number;

  /** Whether the FAQ is published */
  is_published: boolean;

  /** Reviewer name for quality assurance */
  reviewer?: string;

  /** Last updated timestamp (ISO format) */
  last_updated?: string;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}