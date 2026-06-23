const BASE = "/api/iam/users";

export const USER_ENDPOINTS = {
  LIST: `${BASE}/`,
  DETAIL: (id: number) => `${BASE}/${id}/`,
};
