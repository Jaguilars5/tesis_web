import * as Yup from "yup";

export const academicSubnivelSchema = Yup.object({
  code: Yup.string()
    .min(1, "El código es obligatorio")
    .max(20, "Máximo 20 caracteres")
    .required("El código es obligatorio"),
  name: Yup.string()
    .min(1, "El nombre es obligatorio")
    .max(100, "Máximo 100 caracteres")
    .required("El nombre es obligatorio"),
  description: Yup.string(),
  order: Yup.number()
    .integer("Debe ser un número entero")
    .min(0, "El orden debe ser mayor o igual a 0"),
  academic_level: Yup.number()
    .required("El nivel académico es obligatorio"),
  is_active: Yup.boolean(),
});
