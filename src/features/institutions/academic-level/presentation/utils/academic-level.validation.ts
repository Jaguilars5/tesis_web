import * as Yup from "yup";

export const academicLevelSchema = Yup.object({
  name: Yup.string()
    .min(1, "El nombre debe tener al menos 1 caracter")
    .max(100, "El nombre no debe exceder 100 caracteres")
    .required("El nombre es obligatorio"),
  is_active: Yup.boolean(),
});
