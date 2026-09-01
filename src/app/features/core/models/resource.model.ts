// ============================================================
// BRIDGE-AI Kenya - Resource Model
// ============================================================

import { WorkPackageId } from '../constants/wp-constants';

/**
 * Represents a public resource such as a deliverable, guide, video,
 * presentation, or policy brief.
 */
export interface Resource {
  /** Unique identifier for the resource */
  id?: number;

  /** Title of the resource */
  title: string;

  /** URL-friendly slug for the resource */
  slug: string;

  /** Description of the resource */
  description: string;

  /** Type of resource (public-deliverable, training-guide, slide-deck, etc.) */
  resource_type: string;

  /** Work Package associated with this resource */
  wp_tag: WorkPackageId;

  /** Target audience for this resource */
  audience?: string;

  /** Path to the file in Cloudinary (raw upload) */
  file_path?: string;

  /** External URL for the resource (if hosted elsewhere) */
  external_url?: string;

  /** Language of the resource */
  language: string;

  /** License information */
  license?: string;

  /** Whether the resource is publicly accessible */
  is_public: boolean;

  /** Number of times the resource has been downloaded */
  download_count?: number;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Resource filter parameters.
 */
export interface ResourceFilterParams {
  /** Filter by resource type */
  type?: string;

  /** Filter by Work Package */
  wp?: WorkPackageId;

  /** Filter by language */
  language?: string;

  /** Filter by public status */
  is_public?: boolean;

  /** Search term for title and description */
  search?: string;
}