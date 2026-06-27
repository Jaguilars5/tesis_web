import * as Yup from "yup";

export const activityTypeSchema = Yup.object({
  code: Yup.string()
    .max(20, "El código no debe exceder 20 caracteres")
    .required("El código es obligatorio"),
  name: Yup.string()
    .max(100, "El nombre no debe exceder 100 caracteres")
    .required("El nombre es obligatorio"),
  description: Yup.string(),
});
