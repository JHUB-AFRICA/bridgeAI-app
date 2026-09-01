// ============================================================
// BRIDGE-AI Kenya - Community Event Model
// ============================================================

/**
 * Represents a Community of Practice event.
 * These events are part of the community engagement activities.
 */
export interface CommunityEvent {
  /** Unique identifier for the community event */
  id?: number;

  /** Title of the event */
  title: string;

  /** URL-friendly slug for the event */
  slug?: string;

  /** Description of the event */
  description: string;

  /** Date of the event (ISO format: YYYY-MM-DD) */
  date: string;

  /** Time of the event (HH:MM) */
  time?: string;

  /** Location of the event */
  location?: string;

  /** Event type (meeting, workshop, webinar, social) */
  type: 'meeting' | 'workshop' | 'webinar' | 'social';

  /** Event status (upcoming, ongoing, completed, cancelled) */
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  /** Whether the event is published */
  is_published: boolean;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Community event filter parameters.
 */
export interface CommunityEventFilterParams {
  /** Filter by status */
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  /** Filter by type */
  type?: 'meeting' | 'workshop' | 'webinar' | 'social';

  /** Filter by published status */
  is_published?: boolean;

  /** Search term for title and description */
  search?: string;
}