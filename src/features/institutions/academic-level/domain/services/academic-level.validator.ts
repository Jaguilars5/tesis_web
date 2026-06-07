export function validateAcademicLevelName(name: string): string | null {
  if (!name || name.trim().length === 0) return "El nombre es obligatorio";
  if (name.length > 100) return "El nombre no debe exceder 100 caracteres";
  return null;
}
