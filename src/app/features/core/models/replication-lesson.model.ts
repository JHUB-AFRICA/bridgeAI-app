// ============================================================
// BRIDGE-AI Kenya - Replication Lesson Model
// ============================================================

/**
 * Represents a lesson learned from the Smart Mushroom pilot.
 * Lessons are used for replication and knowledge sharing.
 */
export interface ReplicationLesson {
  /** Unique identifier for the lesson */
  id?: number;

  /** Title of the lesson */
  title: string;

  /** URL-friendly slug for the lesson */
  slug?: string;

  /** Description of the lesson */
  description: string;

  /** Additional content (HTML) */
  content?: string;

  /** Subtext or additional notes */
  subtext?: string;

  /** Display order on the lessons page */
  display_order?: number;

  /** Whether the lesson is published */
  is_published: boolean;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Replication lesson filter parameters.
 */
export interface ReplicationLessonFilterParams {
  /** Filter by published status */
  is_published?: boolean;

  /** Search term for title, description, and content */
  search?: string;
}