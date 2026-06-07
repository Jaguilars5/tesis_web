export const normalizeThunkError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "No se pudo completar la operacion";
};
