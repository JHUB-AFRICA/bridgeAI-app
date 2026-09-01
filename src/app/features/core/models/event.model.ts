// ============================================================
// BRIDGE-AI Kenya - Event Model
// ============================================================

/**
 * Represents a training event, bootcamp, workshop, or webinar.
 * Events are the primary mechanism for capacity building (WP5).
 */
export interface Event {
  /** Unique identifier for the event */
  id?: number;

  /** Title of the event */
  title: string;

  /** URL-friendly slug for the event */
  slug: string;

  /** Description of the event (HTML content) */
  description?: string;

  /** Date of the event (ISO format: YYYY-MM-DD) */
  date: string;

  /** Time of the event (HH:MM) */
  time?: string;

  /** Physical location of the event */
  location?: string;

  /** Venue name or building */
  venue?: string;

  /** Agenda or schedule (HTML content) */
  agenda?: string;

  /** Target audience for this event */
  audience?: string;

  /** Maximum number of participants */
  capacity?: number;

  /** Speaker or facilitator information */
  speakers?: string;

  /** Registration link (URL) */
  registration_link?: string;

  /** Event status (upcoming, ongoing, completed, cancelled) */
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  /** Post-event report summary */
  post_event_report?: string;

  /** Featured image URL (stored in Cloudinary) */
  featured_image?: string;

  /** Gallery of images from the event */
  gallery_images?: EventGalleryImage[];

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Gallery image within an event.
 * All images are stored in Cloudinary.
 */
export interface EventGalleryImage {
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
 * Event filter parameters.
 */
export interface EventFilterParams {
  /** Filter by status */
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  /** Filter by audience */
  audience?: string;

  /** Filter by date range */
  start_date?: string;

  /** Filter by date range */
  end_date?: string;

  /** Search term for title and description */
  search?: string;
}