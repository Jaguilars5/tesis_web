import * as Yup from "yup";

export const academicGradeValidationSchema = Yup.object({
  name: Yup.string()
    .min(1, "El nombre debe tener al menos 1 caracter")
    .required("El nombre es obligatorio"),
  academic_subnivel: Yup.number().nullable(),
  sequence_order: Yup.number()
    .integer("Debe ser un número entero")
    .required("El orden es obligatorio"),
  is_active: Yup.boolean(),
});
