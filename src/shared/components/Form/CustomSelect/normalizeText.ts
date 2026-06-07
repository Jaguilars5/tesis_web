export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD") // descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, ""); // elimina marcas diacríticas
};
