import * as Yup from "yup";
export const qualitativeScaleSchema = Yup.object({
  code: Yup.string().required("El código es obligatorio"),
  description: Yup.string().required("La descripción es obligatoria"),
  numeric_equivalence: Yup.number()
    .typeError("Debe ser un número")
    .required("La equivalencia numérica es obligatoria"),
});
