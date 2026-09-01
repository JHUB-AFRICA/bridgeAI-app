// ============================================================
// BRIDGE-AI Kenya - Team Member Model
// ============================================================

/**
 * Represents a team member from JKUAT or JHUB Africa.
 */
export interface TeamMember {
  /** Unique identifier for the team member */
  id?: number;

  /** Full name of the team member */
  name: string;

  /** Role or position */
  role: string;

  /** Affiliation (e.g., "JKUAT", "JHUB Africa") */
  affiliation?: string;

  /** Biography (HTML content) */
  bio?: string;

  /** Email address (only shown if consented) */
  email?: string;

  /** Photo URL (stored in Cloudinary) */
  photo?: string;

  /** Display order on the team page */
  display_order?: number;

  /** Whether the team member is publicly visible */
  is_visible: boolean;

  /** Consent status for publishing personal information */
  consent_status: 'pending' | 'approved' | 'revoked';

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}