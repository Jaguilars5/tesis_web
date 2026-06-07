export const validateCode = (code: string): string | null => {
  if (!code.trim()) return "El código es obligatorio";
  return null;
};
