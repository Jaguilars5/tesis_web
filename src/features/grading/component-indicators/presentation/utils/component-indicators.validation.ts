import * as Yup from "yup";

export const componentIndicatorSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  internal_weight: Yup.number().min(0).max(100).required("La ponderación es obligatoria"),
  block_component: Yup.number().required("El componente de bloque es obligatorio"),
});
