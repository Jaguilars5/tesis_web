export const PROFILE_ENDPOINTS = {
  DETAIL: (id: number) => `/api/iam/users/${id}/`,
} as const;

export const PROFILE_ROUTES = {
  VIEW: "/profile",
} as const;
