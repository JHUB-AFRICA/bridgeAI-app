// ============================================================
// BRIDGE-AI Kenya - Gallery Album Model
// ============================================================

/**
 * Represents a photo album in the gallery.
 * All images are stored in Cloudinary.
 */
export interface GalleryAlbum {
  /** Unique identifier for the album */
  id?: number;

  /** Title of the album */
  title: string;

  /** URL-friendly slug for the album */
  slug: string;

  /** Date of the album content (ISO format: YYYY-MM-DD) */
  date?: string;

  /** Location where the photos were taken */
  location?: string;

  /** Description of the album */
  description?: string;

  /** Whether the album is published */
  is_published: boolean;

  /** Whether consent has been confirmed for all images */
  consent_confirmed: boolean;

  /** Tags for categorisation */
  tags?: string[];

  /** Images in the album */
  images: GalleryImage[];

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * An individual image within a gallery album.
 * All images are stored in Cloudinary.
 */
export interface GalleryImage {
  /** Unique identifier for the image */
  id?: number;

  /** Cloudinary URL of the image */
  image_path: string;

  /** Caption for the image */
  caption?: string;

  /** Alt text for accessibility */
  alt_text?: string;

  /** Whether the image is approved for public display */
  is_approved: boolean;

  /** Whether this is the featured image for the album */
  is_featured?: boolean;

  /** Display order in the album */
  display_order?: number;
}