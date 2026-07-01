export const REPRESENTATIVE_SELF_ROUTES = {
  GRADES: "/representative/grades",
  ATTENDANCE: "/representative/attendance",
  CONDUCT: "/representative/conduct",
} as const;

/**
 * ÚNICO punto a ajustar cuando el backend exponga el endpoint definitivo para
 * obtener los estudiantes (representados) del representante autenticado.
 * El servicio mapea la respuesta de forma tolerante (ver representative.service.ts).
 */
export const REPRESENTADOS_ENDPOINT = "/api/students/enrollments/by-representative/" as const;
