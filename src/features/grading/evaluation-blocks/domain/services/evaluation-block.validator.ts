export const validateEvaluationBlockName = (name: string): string | null => {
  if (!name.trim()) return "El nombre es obligatorio";
  return null;
};
