// ============================================================
// BRIDGE-AI Kenya - Form Submission Models
// ============================================================

/**
 * Base submission model for all form submissions.
 */
export interface BaseSubmission {
  /** Unique identifier for the submission */
  id?: number;

  /** IP address of the submitter */
  ip_address?: string;

  /** User agent of the submitter's browser */
  user_agent?: string;

  /** Whether the submission has been read */
  is_read: boolean;

  /** Whether the submission has been responded to */
  is_responded?: boolean;

  /** Submission timestamp (ISO format) */
  submitted_at?: string;
}

/**
 * General contact form submission.
 */
export interface ContactSubmission extends BaseSubmission {
  /** Name of the submitter */
  name: string;

  /** Email address of the submitter */
  email: string;

  /** Organisation name */
  organisation?: string;

  /** Audience category */
  audience: string;

  /** Message content */
  message: string;

  /** Form type identifier */
  form_type: 'contact';
}

/**
 * Training interest form submission.
 */
export interface TrainingInterestSubmission extends BaseSubmission {
  /** Name of the submitter */
  name: string;

  /** Email address of the submitter */
  email: string;

  /** Phone number */
  phone?: string;

  /** County or location */
  county?: string;

  /** Audience category */
  audience: string;

  /** Training interest area */
  training_interest: string;

  /** Additional message */
  message?: string;

  /** Form type identifier */
  form_type: 'training';
}

/**
 * Media request form submission.
 */
export interface MediaRequestSubmission extends BaseSubmission {
  /** Name of the requester */
  name: string;

  /** Email address of the requester */
  email: string;

  /** Media outlet name */
  outlet: string;

  /** Request type (interview, footage, statement) */
  request_type: string;

  /** Deadline for the request */
  deadline?: string;

  /** Audience category */
  audience: 'media';

  /** Message content */
  message: string;

  /** Form type identifier */
  form_type: 'media';
}

/**
 * SME expression of interest form submission.
 */
export interface SMESubmission extends BaseSubmission {
  /** Name of the SME representative */
  name: string;

  /** Email address */
  email: string;

  /** Organisation name */
  organisation: string;

  /** Industry sector */
  industry: string;

  /** Interest area */
  interest: string;

  /** Additional message */
  message?: string;

  /** Form type identifier */
  form_type: 'sme';
}

/**
 * Community practice join request.
 */
export interface CommunitySubmission extends BaseSubmission {
  /** Name of the applicant */
  name: string;

  /** Email address */
  email: string;

  /** Role in the community */
  role: string;

  /** Interest area */
  interest: string;

  /** GitHub profile URL */
  github?: string;

  /** Additional message */
  message?: string;

  /** Form type identifier */
  form_type: 'community';
}

/**
 * Union type for all submission types.
 */
export type Submission =
  | ContactSubmission
  | TrainingInterestSubmission
  | MediaRequestSubmission
  | SMESubmission
  | CommunitySubmission;

/**
 * Submission type guard functions.
 */
export function isContactSubmission(
  submission: Submission
): submission is ContactSubmission {
  return submission.form_type === 'contact';
}

export function isTrainingInterestSubmission(
  submission: Submission
): submission is TrainingInterestSubmission {
  return submission.form_type === 'training';
}

export function isMediaRequestSubmission(
  submission: Submission
): submission is MediaRequestSubmission {
  return submission.form_type === 'media';
}

export function isSMESubmission(
  submission: Submission
): submission is SMESubmission {
  return submission.form_type === 'sme';
}

export function isCommunitySubmission(
  submission: Submission
): submission is CommunitySubmission {
  return submission.form_type === 'community';
}