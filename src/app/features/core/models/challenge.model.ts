// ============================================================
// BRIDGE-AI Kenya - Challenge Model
// ============================================================

/**
 * Represents an SME innovation challenge.
 * Challenges are used to engage SMEs in solving agricultural problems.
 */
export interface Challenge {
  /** Unique identifier for the challenge */
  id?: number;

  /** Title of the challenge */
  title: string;

  /** URL-friendly slug for the challenge */
  slug?: string;

  /** Description of the challenge */
  description: string;

  /** Challenge status (open, closed, completed) */
  status: 'open' | 'closed' | 'completed';

  /** Deadline for submissions (ISO format: YYYY-MM-DD) */
  deadline?: string;

  /** Whether the challenge is published */
  is_published: boolean;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Challenge filter parameters.
 */
export interface ChallengeFilterParams {
  /** Filter by status */
  status?: 'open' | 'closed' | 'completed';

  /** Filter by published status */
  is_published?: boolean;

  /** Search term for title and description */
  search?: string;
}