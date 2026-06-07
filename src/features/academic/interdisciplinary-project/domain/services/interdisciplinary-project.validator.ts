export const validateInterdisciplinaryProjectTitle = (title: string): string | null => {
  if (!title.trim()) return "El título es obligatorio";
  if (title.length < 1) return "El título debe tener al menos 1 caracter";
  if (title.length > 200) return "El título no debe exceder 200 caracteres";
  return null;
};
