export const validateSectionParallel = (parallel: string): string | null => {
  if (!parallel.trim()) return "El paralelo es obligatorio";
  if (parallel.length < 1) return "El paralelo debe tener al menos 1 caracter";
  return null;
};
