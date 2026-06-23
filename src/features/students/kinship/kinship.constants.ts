export const KINSHIP_ENDPOINTS = { LIST: "/api/students/kinship/", DETAIL: (id: number) => `/api/students/kinship/${id}/` } as const;
export const KINSHIP_PERMISSIONS = { GET: "students.view_kinship" } as const;
