// ============================================================
// BRIDGE-AI Kenya - Replication Template Model
// ============================================================

/**
 * Represents a replication toolkit template.
 * Templates are used for localising the Smart Mushroom pilot.
 */
export interface ReplicationTemplate {
  /** Unique identifier for the template */
  id?: number;

  /** Title of the template */
  title: string;

  /** URL-friendly slug for the template */
  slug?: string;

  /** Description of the template */
  description?: string;

  /** Path to the file in Cloudinary */
  file_path: string;

  /** Whether the template is public */
  is_public?: boolean;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Replication template filter parameters.
 */
export interface ReplicationTemplateFilterParams {
  /** Filter by public status */
  is_public?: boolean;

  /** Search term for title and description */
  search?: string;
}