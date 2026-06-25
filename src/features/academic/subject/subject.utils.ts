import * as Yup from "yup";

export const subjectSchema = Yup.object({
  name: Yup.string()
    .min(1, "El nombre debe tener al menos 1 caracter")
    .max(255, "El nombre no debe exceder 255 caracteres")
    .required("El nombre es obligatorio"),
  code: Yup.string()
    .min(1, "El codigo debe tener al menos 1 caracter")
    .max(100, "El codigo no debe exceder 100 caracteres")
    .required("El codigo es obligatorio"),
});
