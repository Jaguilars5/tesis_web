export const getFullName = (s: { names: string; last_names: string }): string => `${s.names} ${s.last_names}`.trim();
export const formatStudentStatus = (isActive: boolean): string => isActive ? "Activo" : "Inactivo";
