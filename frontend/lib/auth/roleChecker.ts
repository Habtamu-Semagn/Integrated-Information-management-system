import { USER_ROLES } from "../constants";

export const isAdmin = (role: string | undefined) => role === USER_ROLES.ADMIN;
export const isStaff = (role: string | undefined) => role === USER_ROLES.STAFF;
export const isApplicant = (role: string | undefined) => role === USER_ROLES.APPLICANT;

export const hasRole = (userRole: string | undefined, allowedRoles: string[]) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
