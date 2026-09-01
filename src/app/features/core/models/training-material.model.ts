// ============================================================
// BRIDGE-AI Kenya - Training Material Model
// ============================================================

/**
 * Represents a training material for WP5 capacity building.
 * Materials include guides, slide decks, videos, and exercises.
 */
export interface TrainingMaterial {
  /** Unique identifier for the training material */
  id?: number;

  /** Title of the training material */
  title: string;

  /** URL-friendly slug for the training material */
  slug: string;

  /** Description of the training material (HTML) */
  description: string;

  /** Skill level (beginner, intermediate, advanced) */
  level: 'beginner' | 'intermediate' | 'advanced';

  /** Tags for categorisation */
  tags: string[];

  /** Resource type (training-guide, slide-deck, video, exercise, assessment) */
  resource_type: 'training-guide' | 'slide-deck' | 'video' | 'exercise' | 'assessment' | 'other';

  /** Language of the material */
  language: string;

  /** License information */
  license?: string;

  /** Path to the file in Cloudinary */
  file_path?: string;

  /** Whether the material is publicly accessible */
  is_public: boolean;

  /** Display order on the materials page */
  display_order?: number;

  /** Estimated file size */
  file_size?: string;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * Training material filter parameters.
 */
export interface TrainingMaterialFilterParams {
  /** Filter by level */
  level?: 'beginner' | 'intermediate' | 'advanced';

  /** Filter by resource type */
  resource_type?: 'training-guide' | 'slide-deck' | 'video' | 'exercise' | 'assessment' | 'other';

  /** Filter by language */
  language?: string;

  /** Filter by public status */
  is_public?: boolean;

  /** Search term for title and description */
  search?: string;

  /** Filter by tags */
  tags?: string[];
}