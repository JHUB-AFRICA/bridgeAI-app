// ============================================================
// BRIDGE-AI Kenya - Partner Model
// ============================================================

/**
 * Represents a partner organisation, either from the official consortium
 * or from the local ecosystem.
 */
export interface Partner {
  /** Unique identifier for the partner */
  id?: number;

  /** Short name of the partner (e.g., "EURECAT") */
  short_name: string;

  /** Full legal name of the partner */
  name: string;

  /** Country of the partner */
  country: string;

  /** Role of the partner in the project */
  role?: string;

  /** Description of the partner */
  description?: string;

  /** Website URL */
  website?: string;

  /** Logo URL (stored in Cloudinary) */
  logo?: string;

  /** Whether this is a consortium partner */
  is_consortium: boolean;

  /** Display order on the partners page */
  display_order?: number;

  /** Whether the partner is published */
  is_published: boolean;

  /** Tags for categorisation (e.g., "consortium", "local", "research") */
  tags?: string[];

  /** Ecosystem impact description (for local partners) */
  ecosystem_impact?: string;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}