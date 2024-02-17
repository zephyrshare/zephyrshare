/**
 * This file contains the user roles and privileges for the Zephyr application.
 */

/**
 * USER ROLES
 *
 * Users can have multiple roles, but the role with the highest privilege is used.
 */
export enum UserRole {
  ZEPHYR_ADMIN = 'ZEPHYR_ADMIN', // Zephyr Admin is a super user
  ZEPHYR_OPERATOR = 'ZEPHYR_OPERATOR', // Zephyr Operator has full access to Zephyr stats dasbhboard and user management
  ZEPHYR_VIEWER = 'ZEPHYR_VIEWER', // Zephyr Viewer has read-only access to Zephyr, ex an investor or a board member
  OWNER_ADMIN = 'OWNER_ADMIN', // Owner Admin has full access to their organization and its agreements
  OWNER_OPERATOR = 'OWNER_OPERATOR', // Owner Operator has most access to their organization and its agreements
  OWNER_VIEWER = 'OWNER_VIEWER', // Owner Viewer has read-only access to their organization and its agreements
  CUSTOMER_ADMIN = 'CUSTOMER_ADMIN', // Customer Admin has full access to their organization and its agreements
  CUSTOMER_OPERATOR = 'CUSTOMER_OPERATOR', // Customer Operator has most access to their organization and its agreements
  CUSTOMER_VIEWER = 'CUSTOMER_VIEWER', // Customer Viewer has read-only access to their organization and its agreements
}

/**
 * PRIVILEGES
 * 
 * Defines privileges and describes their purpose
 */
export enum Privilege {
  CUSTOMER_CRUD = 'CUSTOMER_CRUD',
  AGREEMENT_CRUD = 'AGREEMENT_CRUD',
}

/**
 * RBAC
 * 
 * This function checks if a user role has a privilege.
 *
 * @param role - The user role
 * @param privilege - The privilege
 * @returns true if the user role has the privilege, false otherwise
 */
export default function rbac(role: string | undefined, privilege: Privilege): boolean {
  let logTrue = `${role} has ${privilege} access`;
  let logFalse = `${role} does NOT have ${privilege} access`;

  // Handle undefined role explicitly
  if (role === undefined) {
    console.log(logFalse);
    return false;
  }

  // Zephyr Admin has all privileges
  if (role === UserRole.ZEPHYR_ADMIN) {
    console.log(logTrue);
    return true;
  }

  switch (privilege) {
    case Privilege.CUSTOMER_CRUD:
      if (role === UserRole.OWNER_ADMIN) {
        console.log(logTrue);
        return true;
      }
      break;
    case Privilege.AGREEMENT_CRUD:
      if (role === UserRole.OWNER_ADMIN || role === UserRole.CUSTOMER_ADMIN) {
        console.log(logTrue);
        return true;
      }
      break;
  }

  console.log(logFalse);
  return false;
}

export function getBaseUrlPath(userRole: string) {
  switch (userRole) {
    case UserRole.ZEPHYR_ADMIN:
    case UserRole.ZEPHYR_OPERATOR:
    case UserRole.ZEPHYR_VIEWER:
      return '/admin';
    case UserRole.OWNER_ADMIN:
    case UserRole.OWNER_OPERATOR:
    case UserRole.OWNER_VIEWER:
    case UserRole.CUSTOMER_ADMIN:
    case UserRole.CUSTOMER_OPERATOR:
    case UserRole.CUSTOMER_VIEWER:
      return '';
    default:
      return '';
  }
}
