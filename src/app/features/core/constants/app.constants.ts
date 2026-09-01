// ============================================================
// BRIDGE-AI Kenya - Application Constants
// ============================================================

/**
 * Core application metadata used across the entire platform.
 * These values are safe to be exposed to the frontend.
 */
export const APP = {
  /**
   * The full, human-readable name of the project.
   */
  NAME: 'BRIDGE-AI Kenya',

  /**
   * The official project acronym.
   */
  ACRONYM: 'BRIDGE-AI',

  /**
   * Current application version (Semantic Versioning).
   * Update this with each release.
   */
  VERSION: '1.0.0',

  /**
   * The full project title for official documents and headers.
   */
  FULL_TITLE: 'Building ResIlient Development with GEnerative AI in Education & Agriculture',

  /**
   * Short, one-line description used for SEO and social media.
   */
  DESCRIPTION: 'Generative AI, IoT sensing, and digital skills for climate-smart mushroom farming and rural innovation in Kenya.'
};

// ============================================================
// Project Funding & Grant Information
// ============================================================

export const FUNDING = {
  /**
   * The official Grant Agreement Number.
   */
  GRANT_AGREEMENT: 'No. 101299050',

  /**
   * The funding program name.
   */
  PROGRAMME: 'Horizon Europe Research and Innovation Action',

  /**
   * The funding authority.
   */
  GRANTING_AUTHORITY: 'European Health and Digital Executive Agency (HADEA)',

  /**
   * EU Emblem display name for the funding banner.
   */
  EU_EMBLEM_TEXT: 'Funded by the European Union',

  /**
   * Official EU Funding Disclaimer.
   */
  DISCLAIMER: `Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Health and Digital Executive Agency. Neither the European Union nor the granting authority can be held responsible for them.`
};

// ============================================================
// Project Partner Information
// ============================================================

export const PARTNER_GROUPS = {
  /**
   * Official consortium partners (8 partners from the Grant Agreement).
   */
  CONSORTIUM: [
    { name: 'FUNDACIO EURECAT', shortName: 'EURECAT', country: 'Spain' },
    { name: 'Universidad Politecnica de Madrid', shortName: 'UPM', country: 'Spain' },
    { name: 'Jomo Kenyatta University of Agriculture and Technology', shortName: 'JKUAT', country: 'Kenya' },
    { name: 'University of Sousse', shortName: 'US', country: 'Tunisia' },
    { name: 'STE LIFEYE SARL', shortName: 'MOOME', country: 'Tunisia' },
    { name: 'AgroInfoTech Labs Limited', shortName: 'AGROINFOTECH', country: 'Nigeria' },
    { name: 'Austria Card', shortName: 'ACV', country: 'Austria' },
    { name: 'Seamless Middleware Technologies SL', shortName: 'SMW', country: 'Spain' }
  ]
};

// ============================================================
// Local Implementation Context (Kenya / JKUAT)
// ============================================================

export const LOCAL_CONTEXT = {
  /**
   * The main hosting institution.
   */
  HOST_INSTITUTION: 'Jomo Kenyatta University of Agriculture and Technology (JKUAT)',

  /**
   * The local innovation and outreach hub.
   */
  HUB: 'JHUB Africa',

  /**
   * The physical location of the pilot farm.
   */
  PILOT_SITE: 'Mushroom Demonstration Farm, JKUAT Smart Farm Zone, Juja, Kenya',

  /**
   * The local implementor role.
   */
  IMPLEMENTOR_ROLE: 'Kenyan beneficiary and WP5 Capacity Building and Replication lead',

  /**
   * The local focus area.
   */
  FOCUS_AREA: 'Smart Mushroom Farming using GenAI and IoT'
};

// ============================================================
// Social & External Links
// ============================================================

export const SOCIAL_LINKS = {
  /**
   * Central project social media and websites.
   */
  PROJECT_WEBSITE: 'https://bridge-ai.eu', // Placeholder - Update when available

  /**
   * LinkedIn page URL.
   */
  LINKEDIN: 'https://linkedin.com/company/bridge-ai', // Placeholder

  /**
   * YouTube channel URL.
   */
  YOUTUBE: 'https://youtube.com/@bridge-ai', // Placeholder

  /**
   * GitHub organization URL (for open-source repositories).
   */
  GITHUB: 'https://github.com/bridge-ai' // Placeholder
};

// ============================================================
// Navigation & Routing Constants
// ============================================================

export const ROUTES = {
  /**
   * Base path for the entire BRIDGE-AI section.
   * Matches the recommended URL structure.
   */
  BASE_PATH: '/bridge-ai',

  /**
   * Public routes mapping for easy reference.
   */
  PUBLIC: {
    HOME: '',
    ABOUT: 'about',
    JKUAT_ROLE: 'jkuat-role',
    SMART_MUSHROOMS: 'smart-mushrooms',
    ACTIVITIES: 'activities',
    ACTIVITY_DETAIL: 'activities/:slug',
    TRAINING_WP5: 'training-wp5',
    TRAINING_EVENTS: 'training-events',
    EVENT_DETAIL: 'training-events/:slug',
    TRAINING_MATERIALS: 'training-materials',
    MATERIAL_DETAIL: 'training-materials/:slug',
    SME_MENTORING: 'sme-mentoring',
    COMMUNITY_PRACTICE: 'community-practice',
    REPLICATION_TOOLKIT: 'replication-toolkit',
    RESOURCES: 'resources',
    RESOURCE_DETAIL: 'resources/:slug',
    PARTNERS: 'partners',
    GALLERY: 'gallery',
    GALLERY_ALBUM: 'gallery/:slug',
    CONTACT: 'contact',
    PRIVACY_ETHICS: 'privacy-ethics'
  },

  /**
   * Admin routes (protected by AuthGuard and AdminGuard).
   */
  ADMIN: {
    BASE: 'admin',
    DASHBOARD: '',
    ACTIVITIES: 'activities',
    EVENTS: 'events',
    RESOURCES: 'resources',
    PARTNERS: 'partners',
    TEAM: 'team',
    GALLERY: 'gallery',
    FAQS: 'faqs',
    TRAINING_MATERIALS: 'training-materials',
    SME: 'sme',
    COMMUNITY: 'community',
    REPLICATION: 'replication',
    SUBMISSIONS: 'submissions'
  }
};

// ============================================================
// File Upload & Media Constants (Cloudinary Integration)
// ============================================================

export const MEDIA = {
  /**
   * Maximum file size for uploads (in bytes).
   * 10MB = 10 * 1024 * 1024 = 10,485,760 bytes.
   */
  MAX_FILE_SIZE: 10485760,

  /**
   * Maximum file size for images (in bytes).
   * 5MB = 5,242,880 bytes.
   */
  MAX_IMAGE_SIZE: 5242880,

  /**
   * Maximum file size for videos (in bytes).
   * 50MB = 52,428,800 bytes.
   */
  MAX_VIDEO_SIZE: 52428800,

  /**
   * Allowed image file types.
   */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],

  /**
   * Allowed video file types.
   */
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mov', 'video/avi', 'video/webm'],

  /**
   * Allowed document file types.
   */
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-rar-compressed',
    'text/plain',
    'text/csv',
    'application/json',
    'application/xml'
  ],

  /**
   * Human-readable file size labels for display.
   */
  FILE_SIZE_LABELS: {
    BYTES: 'Bytes',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB'
  }
} as const;

// ============================================================
// Application Feature Flags
// ============================================================

export const FEATURES = {
  /**
   * Enable/disable the admin panel.
   */
  ADMIN_ENABLED: true,

  /**
   * Enable/disable user registration.
   */
  REGISTRATION_ENABLED: false, // Typically admin-only for this project

  /**
   * Enable/disable comments on activities.
   */
  COMMENTS_ENABLED: false,

  /**
   * Enable/disable the gallery module.
   */
  GALLERY_ENABLED: true,

  /**
   * Enable/disable the training materials module.
   */
  TRAINING_ENABLED: true
};

// ============================================================
// UI & UX Constants
// ============================================================

export const UI = {
  /**
   * Default pagination page size.
   */
  DEFAULT_PAGE_SIZE: 10,

  /**
   * Pagination page size options.
   */
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],

  /**
   * Default image placeholder URL (Base64 transparent PNG).
   * This should be a small, safe placeholder image.
   */
  PLACEHOLDER_IMAGE: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50" y="115" font-family="sans-serif" font-size="18" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E',

  /**
   * Default avatar placeholder URL.
   */
  AVATAR_PLACEHOLDER: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23e5e7eb"/%3E%3Ctext x="40" y="65" font-family="sans-serif" font-size="40" fill="%239ca3af"%3E👤%3C/text%3E%3C/svg%3E',

  /**
   * Date format patterns.
   */
  DATE_FORMATS: {
    SHORT: 'dd/MM/yyyy',
    MEDIUM: 'dd MMM yyyy',
    LONG: 'dd MMMM yyyy',
    FULL: 'EEEE, dd MMMM yyyy',
    DATETIME: 'dd MMM yyyy, HH:mm',
    TIME: 'HH:mm'
  }
};

// ============================================================
// Type Safety: Ensure constants are readonly
// ============================================================

export type AppConstants = typeof APP;
export type FundingInfo = typeof FUNDING;
export type NavigationRoutes = typeof ROUTES;
export type MediaConfig = typeof MEDIA;