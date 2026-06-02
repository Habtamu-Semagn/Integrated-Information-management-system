export const APP_NAME = "Startup Support System";

export const USER_ROLES = {
  APPLICANT: "applicant",
  STAFF: "staff",
  ADMIN: "admin",
} as const;

export const APPLICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/applications",
  APPLICATIONS: "/applications",
  APPLICATION_DETAIL: (id: string) => `/applications/${id}`,
  // Future routes
  // FUNDING: "/funding",
  // MENTORSHIP: "/mentorship",
} as const;
