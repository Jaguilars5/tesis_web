/**
 * Re-exporta el hook compartido de fuente única para las opciones de "Clase".
 * El módulo de asistencia consume este hook a través del barrel `attendance/index.ts`,
 * por lo que los importadores existentes no necesitan cambiar.
 */
export { useTeacherSubjectSectionOptions } from "@shared/hooks/useTeacherSubjectSectionOptions";
