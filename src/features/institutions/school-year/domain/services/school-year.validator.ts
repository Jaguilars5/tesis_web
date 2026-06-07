export const validateSchoolYearName = (name: string): string | null => {
  if (!name.trim()) return "El nombre es obligatorio";
  if (name.length < 4) return "El nombre debe tener al menos 4 caracteres";
  return null;
};
