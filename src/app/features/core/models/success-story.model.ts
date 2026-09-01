// ============================================================
// BRIDGE-AI Kenya - Success Story Model
// ============================================================

/**
 * Represents a success story from an SME or participant.
 * Stories highlight the impact of the BRIDGE-AI project.
 */
export interface SuccessStory {
  /** Unique identifier for the success story */
  id?: number;

  /** Title of the success story */
  title: string;

  /** URL-friendly slug for the success story */
  slug?: string;

  /** Name of the SME or participant */
  sme_name: string;

  /** Industry sector of the SME */
  industry?: string;

  /** The story content (HTML) */
  story: string;

  /** Image URL (stored in Cloudinary) */
  image?: string;

  /** Display order on the stories page */
  display_order?: number;

  /** Whether the story is published */
  is_published: boolean;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Success story filter parameters.
 */
export interface SuccessStoryFilterParams {
  /** Filter by published status */
  is_published?: boolean;

  /** Filter by industry */
  industry?: string;

  /** Search term for title, SME name, and story */
  search?: string;
}