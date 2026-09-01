// ============================================================
// BRIDGE-AI Kenya - Work Package Constants
// ============================================================

/**
 * Work Package (WP) definitions for the BRIDGE-AI project.
 *
 * These are used for:
 * - Tagging activities and resources
 * - Filtering content by WP
 * - Reporting and dissemination tracking
 */
export const WORK_PACKAGES = [
  {
    id: 'WP1',
    name: 'Project Management',
    description: 'Coordination, management, and administration of the project',
    lead: 'EURECAT',
    color: '#3b82f6',
    shortName: 'Management'
  },
  {
    id: 'WP2',
    name: 'Technical Development',
    description: 'Development of the GenAI platform, IoT integration, and semantic interoperability',
    lead: 'UPM',
    color: '#8b5cf6',
    shortName: 'Technical'
  },
  {
    id: 'WP3',
    name: 'Pilot Implementation',
    description: 'Implementation and validation of the Smart Mushroom pilot in Kenya',
    lead: 'JKUAT',
    color: '#22c55e',
    shortName: 'Pilot'
  },
  {
    id: 'WP4',
    name: 'Evaluation',
    description: 'Evaluation of the pilot outcomes and impact assessment',
    lead: 'EURECAT',
    color: '#f59e0b',
    shortName: 'Evaluation'
  },
  {
    id: 'WP5',
    name: 'Capacity Building and Replication',
    description: 'Training, SME mentoring, open repositories, and replication planning',
    lead: 'JKUAT',
    color: '#ef4444',
    shortName: 'Capacity Building'
  },
  {
    id: 'WP6',
    name: 'Dissemination and Communication',
    description: 'Communication, dissemination, and stakeholder engagement',
    lead: 'UPM',
    color: '#06b6d4',
    shortName: 'Communication'
  }
] as const;

/**
 * Type representing a Work Package ID.
 */
export type WorkPackageId = typeof WORK_PACKAGES[number]['id'];

/**
 * Type representing a Work Package object.
 */
export type WorkPackage = typeof WORK_PACKAGES[number];

/**
 * Get a Work Package by its ID.
 * @param id - The Work Package ID (e.g., 'WP5')
 * @returns The Work Package object or undefined
 */
export function getWorkPackageById(id: WorkPackageId): WorkPackage | undefined {
  return WORK_PACKAGES.find((wp) => wp.id === id);
}

/**
 * Get the name of a Work Package by its ID.
 * @param id - The Work Package ID (e.g., 'WP5')
 * @returns The Work Package name or the ID if not found
 */
export function getWorkPackageName(id: WorkPackageId): string {
  for (const wp of WORK_PACKAGES) {
    if (wp.id === id) {
      return wp.name;
    }
  }
  return id;
}

/**
 * Get the display color for a Work Package.
 * @param id - The Work Package ID
 * @returns The color hex code or a default color
 */
export function getWorkPackageColor(id: WorkPackageId): string {
  for (const wp of WORK_PACKAGES) {
    if (wp.id === id) {
      return wp.color;
    }
  }
  return '#6b7280';
}

/**
 * Get the short name for a Work Package.
 * @param id - The Work Package ID
 * @returns The short name or the full name if not available
 */
export function getWorkPackageShortName(id: WorkPackageId): string {
  const wp = getWorkPackageById(id);
  if (wp) {
    return (wp as WorkPackage).shortName ?? (wp as WorkPackage).name;
  }
  return id;
}

/**
 * Check if a given ID is a valid Work Package ID.
 * @param id - The ID to check
 * @returns True if the ID is a valid Work Package ID
 */
export function isValidWorkPackage(id: string): id is WorkPackageId {
  return WORK_PACKAGES.some((wp) => wp.id === id);
}

/**
 * Work Package tags for filtering and categorization.
 */
export const WORK_PACKAGE_TAGS = WORK_PACKAGES.map((wp) => wp.id);

/**
 * Work Package names for display.
 */
export const WORK_PACKAGE_NAMES = WORK_PACKAGES.map((wp) => wp.name);

/**
 * Work Package colors for display.
 */
export const WORK_PACKAGE_COLORS = WORK_PACKAGES.map((wp) => wp.color);

/**
 * Work Package to Activity Type Mapping.
 */
export const WP_ACTIVITY_TYPES: Record<WorkPackageId, string[]> = {
  WP1: ['meeting', 'report', 'management'],
  WP2: ['development', 'technical', 'integration'],
  WP3: ['pilot', 'field-demo', 'implementation'],
  WP4: ['evaluation', 'assessment', 'report'],
  WP5: ['training', 'workshop', 'bootcamp', 'mentoring', 'replication'],
  WP6: ['dissemination', 'communication', 'media', 'publication']
} as const;

/**
 * Work Package Lead Institutions.
 */
export const WP_LEADS: Record<WorkPackageId, string> = {
  WP1: 'EURECAT',
  WP2: 'UPM',
  WP3: 'JKUAT',
  WP4: 'EURECAT',
  WP5: 'JKUAT',
  WP6: 'UPM'
};

/**
 * Type for Work Package colors.
 */
export type WorkPackageColor = typeof WORK_PACKAGE_COLORS[number];

/**
 * Type for Work Package tags.
 */
export type WorkPackageTag = typeof WORK_PACKAGE_TAGS[number];