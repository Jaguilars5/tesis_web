export const validateAcademicGradeName = (name: string): string | null => {
  if (!name.trim()) return "El nombre es obligatorio";
  if (name.length < 1) return "El nombre debe tener al menos 1 caracter";
  return null;
};
