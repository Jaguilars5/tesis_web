import * as Yup from "yup";

export const permissionSchema = Yup.object({
  code: Yup.string()
    .required("El código es obligatorio")
    .max(100, "El código no debe exceder 100 caracteres"),
  description: Yup.string()
    .required("La descripción es obligatoria")
    .max(255, "La descripción no debe exceder 255 caracteres"),
  module: Yup.string()
    .required("El módulo es obligatorio")
    .max(100, "El módulo no debe exceder 100 caracteres"),
});
