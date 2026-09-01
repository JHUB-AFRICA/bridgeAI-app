// ============================================================
// BRIDGE-AI Kenya - Replication Resource Model
// ============================================================

/**
 * Represents a replication toolkit resource.
 * These are documents and materials for replicating the Smart Mushroom pilot.
 */
export interface ReplicationResource {
  /** Unique identifier for the resource */
  id?: number;

  /** Title of the resource */
  title: string;

  /** URL-friendly slug for the resource */
  slug?: string;

  /** Description of the resource */
  description?: string;

  /** Path to the file in Cloudinary */
  file_path: string;

  /** Whether the resource is public */
  is_public?: boolean;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Replication resource filter parameters.
 */
export interface ReplicationResourceFilterParams {
  /** Filter by public status */
  is_public?: boolean;

  /** Search term for title and description */
  search?: string;
}