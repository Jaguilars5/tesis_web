import * as Yup from "yup";

export const qualitativeScaleSchema = Yup.object({
  code: Yup.string()
    .max(10, "El código no debe exceder 10 caracteres")
    .required("El código es obligatorio"),
  name: Yup.string()
    .max(100, "El nombre no debe exceder 100 caracteres"),
  description: Yup.string().required("La descripción es obligatoria"),
  numeric_equivalence: Yup.number()
    .typeError("Debe ser un número")
    .min(0, "La equivalencia debe ser mayor o igual a 0")
    .max(10, "La equivalencia no debe exceder 10")
    .required("La equivalencia numérica es obligatoria"),
});
