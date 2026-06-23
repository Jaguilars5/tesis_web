import * as Yup from "yup";

export const roleSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .max(150, "El nombre no debe exceder 150 caracteres"),
  description: Yup.string()
    .required("La descripción es obligatoria")
    .max(255, "La descripción no debe exceder 255 caracteres"),
  is_active: Yup.boolean(),
});
