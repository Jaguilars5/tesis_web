export const GRADE_HISTORY_ENDPOINTS = { LIST: "/api/grading/grade-history/", DETAIL: (id: number) => `/api/grading/grade-history/${id}/` } as const;
export const GRADE_HISTORY_PERMISSIONS = { GET: "grading.view_grade_history" } as const;
