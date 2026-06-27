import * as Yup from "yup";

export const blockComponentSchema = Yup.object({
  code: Yup.string().max(50, "El código no debe exceder 50 caracteres"),
  name: Yup.string()
    .max(100, "El nombre no debe exceder 100 caracteres")
    .required("El nombre es obligatorio"),
  internal_weight: Yup.number()
    .min(0, "La ponderación debe ser mayor o igual a 0")
    .max(100, "La ponderación no debe exceder 100")
    .required("La ponderación es obligatoria"),
  evaluation_block: Yup.number()
    .min(1, "Debe seleccionar un bloque de evaluación")
    .required("El bloque de evaluación es obligatorio"),
});
