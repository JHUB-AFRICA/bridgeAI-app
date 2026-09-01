// ============================================================
// BRIDGE-AI Kenya - Hackathon Model
// ============================================================

/**
 * Represents a hackathon event.
 * Hackathons are part of the SME engagement and capacity building activities.
 */
export interface Hackathon {
  /** Unique identifier for the hackathon */
  id?: number;

  /** Title of the hackathon */
  title: string;

  /** URL-friendly slug for the hackathon */
  slug?: string;

  /** Description of the hackathon */
  description: string;

  /** Date of the hackathon (ISO format: YYYY-MM-DD) */
  date: string;

  /** Location of the hackathon */
  location?: string;

  /** Hackathon status (upcoming, ongoing, completed, cancelled) */
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  /** Whether the hackathon is published */
  is_published: boolean;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Hackathon filter parameters.
 */
export interface HackathonFilterParams {
  /** Filter by status */
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  /** Filter by published status */
  is_published?: boolean;

  /** Search term for title and description */
  search?: string;
}