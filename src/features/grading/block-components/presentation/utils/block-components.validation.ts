import * as Yup from "yup";
export const blockComponentSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  internal_weight: Yup.number().min(0).max(100).required("La ponderación es obligatoria"),
  evaluation_block: Yup.number().required("El bloque de evaluación es obligatorio"),
});
