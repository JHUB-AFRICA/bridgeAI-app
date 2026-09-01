// ============================================================
// BRIDGE-AI Kenya - Repository Model
// ============================================================

/**
 * Represents a code repository for the Community of Practice.
 * Repositories are used to share open-source code and resources.
 */
export interface Repository {
  /** Unique identifier for the repository */
  id?: number;

  /** Name of the repository */
  name: string;

  /** URL-friendly slug for the repository */
  slug?: string;

  /** Description of the repository */
  description: string;

  /** Repository URL (GitHub, GitLab, etc.) */
  url: string;

  /** Programming language used */
  language?: string;

  /** License type */
  license?: string;

  /** Display order on the repositories page */
  display_order?: number;

  /** Whether the repository is published */
  is_published: boolean;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Repository filter parameters.
 */
export interface RepositoryFilterParams {
  /** Filter by published status */
  is_published?: boolean;

  /** Filter by language */
  language?: string;

  /** Search term for name and description */
  search?: string;
}