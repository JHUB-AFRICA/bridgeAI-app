// ============================================================
// BRIDGE-AI Kenya - API Constants
// ============================================================

import { environment } from '../../../../environments/environment';

/**
 * The base URL for all API requests.
 * This is dynamically sourced from the environment file.
 */
export const API_BASE_URL = environment.apiUrl;

/**
 * API Endpoints for all resources in the BRIDGE-AI project.
 *
 * Usage: `API_ENDPOINTS.ACTIVITIES.GET_ALL`
 */
export const API_ENDPOINTS = {
  // ============================================================
  // Public Resources (Read/Write)
  // ============================================================

  ACTIVITIES: {
    GET_ALL: '/activities',
    GET_BY_ID: (id: number | string): string => `/activities/${id}`,
    GET_BY_SLUG: (slug: string): string => `/activities/${slug}`,
    CREATE: '/activities',
    UPDATE: (id: number | string): string => `/activities/${id}`,
    DELETE: (id: number | string): string => `/activities/${id}`,
    FILTERED: '/activities/filtered'
  },

  EVENTS: {
    GET_ALL: '/events',
    GET_BY_ID: (id: number | string): string => `/events/${id}`,
    GET_BY_SLUG: (slug: string): string => `/events/${slug}`,
    CREATE: '/events',
    UPDATE: (id: number | string): string => `/events/${id}`,
    DELETE: (id: number | string): string => `/events/${id}`
  },

  RESOURCES: {
    GET_ALL: '/resources',
    GET_BY_ID: (id: number | string): string => `/resources/${id}`,
    GET_BY_SLUG: (slug: string): string => `/resources/${slug}`,
    CREATE: '/resources',
    UPDATE: (id: number | string): string => `/resources/${id}`,
    DELETE: (id: number | string): string => `/resources/${id}`
  },

  PARTNERS: {
    GET_ALL: '/partners',
    GET_BY_ID: (id: number | string): string => `/partners/${id}`,
    CREATE: '/partners',
    UPDATE: (id: number | string): string => `/partners/${id}`,
    DELETE: (id: number | string): string => `/partners/${id}`
  },

  TEAM: {
    GET_ALL: '/team',
    GET_BY_ID: (id: number | string): string => `/team/${id}`,
    CREATE: '/team',
    UPDATE: (id: number | string): string => `/team/${id}`,
    DELETE: (id: number | string): string => `/team/${id}`
  },

  GALLERY: {
    GET_ALL: '/gallery',
    GET_BY_ID: (id: number | string): string => `/gallery/${id}`,
    GET_BY_SLUG: (slug: string): string => `/gallery/${slug}`,
    CREATE: '/gallery',
    UPDATE: (id: number | string): string => `/gallery/${id}`,
    DELETE: (id: number | string): string => `/gallery/${id}`
  },

  FAQS: {
    GET_ALL: '/faqs',
    GET_BY_ID: (id: number | string): string => `/faqs/${id}`,
    CREATE: '/faqs',
    UPDATE: (id: number | string): string => `/faqs/${id}`,
    DELETE: (id: number | string): string => `/faqs/${id}`
  },

  // ============================================================
  // Training & WP5 Resources
  // ============================================================

  TRAINING_MATERIALS: {
    GET_ALL: '/training-materials',
    GET_BY_ID: (id: number | string): string => `/training-materials/${id}`,
    GET_BY_SLUG: (slug: string): string => `/training-materials/${slug}`,
    CREATE: '/training-materials',
    UPDATE: (id: number | string): string => `/training-materials/${id}`,
    DELETE: (id: number | string): string => `/training-materials/${id}`
  },

  CHALLENGES: {
    GET_ALL: '/challenges',
    GET_BY_ID: (id: number | string): string => `/challenges/${id}`,
    CREATE: '/challenges',
    UPDATE: (id: number | string): string => `/challenges/${id}`,
    DELETE: (id: number | string): string => `/challenges/${id}`
  },

  HACKATHONS: {
    GET_ALL: '/hackathons',
    GET_BY_ID: (id: number | string): string => `/hackathons/${id}`,
    CREATE: '/hackathons',
    UPDATE: (id: number | string): string => `/hackathons/${id}`,
    DELETE: (id: number | string): string => `/hackathons/${id}`
  },

  SUCCESS_STORIES: {
    GET_ALL: '/success-stories',
    GET_BY_ID: (id: number | string): string => `/success-stories/${id}`,
    CREATE: '/success-stories',
    UPDATE: (id: number | string): string => `/success-stories/${id}`,
    DELETE: (id: number | string): string => `/success-stories/${id}`
  },

  // ============================================================
  // Community of Practice
  // ============================================================

  REPOSITORIES: {
    GET_ALL: '/repositories',
    GET_BY_ID: (id: number | string): string => `/repositories/${id}`,
    CREATE: '/repositories',
    UPDATE: (id: number | string): string => `/repositories/${id}`,
    DELETE: (id: number | string): string => `/repositories/${id}`
  },

  COMMUNITY_EVENTS: {
    GET_ALL: '/community-events',
    GET_BY_ID: (id: number | string): string => `/community-events/${id}`,
    CREATE: '/community-events',
    UPDATE: (id: number | string): string => `/community-events/${id}`,
    DELETE: (id: number | string): string => `/community-events/${id}`
  },

  // ============================================================
  // Replication Toolkit
  // ============================================================

  REPLICATION_RESOURCES: {
    GET_ALL: '/replication-resources',
    GET_BY_ID: (id: number | string): string => `/replication-resources/${id}`,
    CREATE: '/replication-resources',
    UPDATE: (id: number | string): string => `/replication-resources/${id}`,
    DELETE: (id: number | string): string => `/replication-resources/${id}`
  },

  REPLICATION_TEMPLATES: {
    GET_ALL: '/replication-templates',
    GET_BY_ID: (id: number | string): string => `/replication-templates/${id}`,
    CREATE: '/replication-templates',
    UPDATE: (id: number | string): string => `/replication-templates/${id}`,
    DELETE: (id: number | string): string => `/replication-templates/${id}`
  },

  REPLICATION_LESSONS: {
    GET_ALL: '/replication-lessons',
    GET_BY_ID: (id: number | string): string => `/replication-lessons/${id}`,
    GET_BY_SLUG: (slug: string): string => `/replication-lessons/${slug}`,
    CREATE: '/replication-lessons',
    UPDATE: (id: number | string): string => `/replication-lessons/${id}`,
    DELETE: (id: number | string): string => `/replication-lessons/${id}`
  },

  // ============================================================
  // Form Submissions (Admin Only)
  // ============================================================

  SUBMISSIONS: {
    GET_ALL: '/submissions',
    GET_BY_ID: (id: number | string): string => `/submissions/${id}`,
    CREATE: '/submissions',
    UPDATE: (id: number | string): string => `/submissions/${id}`,
    DELETE: (id: number | string): string => `/submissions/${id}`,
    CLEAR_ALL: '/submissions/clear'
  },

  SME_SUBMISSIONS: {
    GET_ALL: '/sme-submissions',
    GET_BY_ID: (id: number | string): string => `/sme-submissions/${id}`,
    CREATE: '/sme-submissions',
    UPDATE: (id: number | string): string => `/sme-submissions/${id}`,
    DELETE: (id: number | string): string => `/sme-submissions/${id}`,
    CLEAR_ALL: '/sme-submissions/clear'
  },

  COMMUNITY_SUBMISSIONS: {
    GET_ALL: '/community-submissions',
    GET_BY_ID: (id: number | string): string => `/community-submissions/${id}`,
    CREATE: '/community-submissions',
    UPDATE: (id: number | string): string => `/community-submissions/${id}`,
    DELETE: (id: number | string): string => `/community-submissions/${id}`,
    CLEAR_ALL: '/community-submissions/clear'
  },

  // ============================================================
  // Authentication
  // ============================================================

  AUTH: {
    LOGIN: '/admin/login',
    LOGOUT: '/admin/logout',
    REGISTER: '/admin/register',
    SESSION: '/admin/session',
    VERIFY: '/admin/verify'
  },

  // ============================================================
  // User Management (Admin Only)
  // ============================================================

  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: number | string): string => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: number | string): string => `/users/${id}`,
    DELETE: (id: number | string): string => `/users/${id}`
  },

  // ============================================================
  // Settings & Configuration
  // ============================================================

  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings'
  },

  // ============================================================
  // Utility & System
  // ============================================================

  HEALTH: {
    CHECK: '/health'
  },

  HERO_IMAGES: {
    GET_ALL: '/hero-images'
  },

  ACTIVITY_IMAGES: {
    GET_ALL: '/activities/images'
  }
};

/**
 * Type for API Endpoints (for type safety in services).
 */
export type ApiEndpointKeys = keyof typeof API_ENDPOINTS;
export type Endpoint = string;

/**
 * Helper to build full API URLs.
 * @param endpoint - The endpoint path (e.g., '/activities')
 * @returns Full API URL (e.g., 'http://localhost:5000/api/activities')
 */
export function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

/**
 * Helper to build API URLs with ID placeholders replaced.
 * @param endpoint - The endpoint with a placeholder (e.g., '/activities/:id')
 * @param replacements - Key-value pairs for replacements
 * @returns The resolved URL
 */
export function buildApiUrlWithParams(
  endpoint: string,
  replacements: Record<string, string | number>
): string {
  let url = endpoint;
  for (const [key, value] of Object.entries(replacements)) {
    url = url.replace(`:${key}`, String(value));
  }
  return `${API_BASE_URL}${url}`;
}

// ============================================================
// Security & HTTP Headers Constants
// ============================================================

export const HTTP_HEADERS = {
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_FORM_DATA: 'multipart/form-data',
  AUTH_HEADER_PREFIX: 'Bearer',
  TOKEN_STORAGE_KEY: 'auth_token'
};

// ============================================================
// HTTP Status Codes (for easier reference)
// ============================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];