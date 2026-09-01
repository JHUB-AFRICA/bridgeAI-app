// ============================================================
// BRIDGE-AI Kenya - Activity Model
// ============================================================

import { WorkPackageId } from '../constants/wp-constants';

/**
 * Represents an activity or news item in the BRIDGE-AI project.
 * Activities are used to document events, training sessions, workshops,
 * field demonstrations, and other project-related activities.
 */
export interface Activity {
  /** Unique identifier for the activity */
  id?: number;

  /** Title of the activity */
  title: string;

  /** URL-friendly slug for the activity */
  slug: string;

  /** Short summary of the activity (for cards and listings) */
  summary?: string;

  /** Full HTML content of the activity */
  body: string;

  /** Date of the activity (ISO format: YYYY-MM-DD) */
  date: string;

  /** Location where the activity took place */
  location?: string;

  /** Work Package tag (WP1, WP2, WP3, WP4, WP5, WP6) */
  wp_tag: WorkPackageId;

  /** Type of activity (training, workshop, bootcamp, field-demo, meeting, etc.) */
  activity_type: string;

  /** Target audience for this activity */
  audience: string;

  /** Author of the activity post */
  author?: string;

  /** URL of the featured image (stored in Cloudinary) */
  featured_image?: string;

  /** Gallery of images related to the activity (stored in Cloudinary) */
  gallery_images?: ActivityGalleryImage[];

  /** Related resource IDs */
  related_resources?: number[];

  /** Publication status (draft, reviewed, published, archived) */
  evidence_status: 'draft' | 'reviewed' | 'published' | 'archived';

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Gallery image within an activity.
 * All images are stored in Cloudinary.
 */
export interface ActivityGalleryImage {
  /** Unique identifier for the image within the gallery */
  id?: number;

  /** Cloudinary URL of the image */
  image_path: string;

  /** Caption or description for the image */
  caption?: string;

  /** Display order in the gallery */
  display_order?: number;
}

/**
 * Activity filter parameters for the activities list.
 */
export interface ActivityFilterParams {
  /** Filter by Work Package */
  wp?: WorkPackageId;

  /** Filter by audience */
  audience?: string;

  /** Filter by activity type */
  type?: string;

  /** Filter by year */
  year?: string;

  /** Search term for title and body */
  search?: string;
}

/**
 * Activity type count for statistics display.
 */
export interface ActivityTypeCount {
  /** The activity type name */
  type: string;

  /** Number of activities of this type */
  count: number;
}