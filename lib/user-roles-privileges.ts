/**
 * This file contains the user roles and privileges for the Zephyr application.
 */

/**
 * USER ROLES
 *
 * Users can have multiple roles, but the role with the highest privilege is used.
 */
export enum ZephyrRole {
  ZEPHYR_ADMIN = 'ZEPHYR_ADMIN', // Zephyr Admin is a super user
  ZEPHYR_OPERATOR = 'ZEPHYR_OPERATOR', // Zephyr Operator has full access to Zephyr stats dasbhboard and user management
  ZEPHYR_VIEWER = 'ZEPHYR_VIEWER', // Zephyr Viewer has read-only access to Zephyr, ex an investor or a board member
}

export enum OwnerRole {
  OWNER_ADMIN = 'OWNER_ADMIN', // Owner Admin has full access to their organization and its agreements
  OWNER_OPERATOR = 'OWNER_OPERATOR', // Owner Operator has most access to their organization and its agreements
  OWNER_VIEWER = 'OWNER_VIEWER', // Owner Viewer has read-only access to their organization and its agreements
}

export enum CustomerRole {
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
  if (role === ZephyrRole.ZEPHYR_ADMIN) {
    console.log(logTrue);
    return true;
  }

  switch (privilege) {
    case Privilege.CUSTOMER_CRUD:
      if (role === OwnerRole.OWNER_ADMIN) {
        console.log(logTrue);
        return true;
      }
      break;
    case Privilege.AGREEMENT_CRUD:
      if (role === OwnerRole.OWNER_ADMIN || role === CustomerRole.CUSTOMER_ADMIN) {
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
    case ZephyrRole.ZEPHYR_ADMIN:
    case ZephyrRole.ZEPHYR_OPERATOR:
    case ZephyrRole.ZEPHYR_VIEWER:
      return '/zs';
    case OwnerRole.OWNER_ADMIN:
    case OwnerRole.OWNER_OPERATOR:
    case OwnerRole.OWNER_VIEWER:
      return '/owner';
    case CustomerRole.CUSTOMER_ADMIN:
    case CustomerRole.CUSTOMER_OPERATOR:
    case CustomerRole.CUSTOMER_VIEWER:
      return '/customer';
    default:
      return '/';
  }
}
