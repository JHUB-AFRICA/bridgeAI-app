// ============================================================
// BRIDGE-AI Kenya - User Model
// ============================================================

/**
 * Represents a system user (admin, editor, reviewer).
 */
export interface User {
  /** Unique identifier for the user */
  id?: number;

  /** Username for login */
  username: string;

  /** Hashed password (stored only on backend) */
  password_hash?: string;

  /** Display name of the user */
  display_name?: string;

  /** Email address of the user */
  email?: string;

  /** Role of the user */
  role: 'admin' | 'editor' | 'reviewer' | 'viewer';

  /** Whether the user account is active */
  is_active: boolean;

  /** Last login timestamp (ISO format) */
  last_login?: string;

  /** Creation timestamp (ISO format) */
  created_at?: string;

  /** Last update timestamp (ISO format) */
  updated_at?: string;
}

/**
 * User login request payload.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * User login response.
 */
export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}