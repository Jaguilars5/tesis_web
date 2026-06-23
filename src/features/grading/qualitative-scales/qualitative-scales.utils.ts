import * as Yup from "yup";
export const qualitativeScaleSchema = Yup.object({ code: Yup.string().max(10).required("El código es obligatorio"), name: Yup.string().max(100), description: Yup.string().required("La descripción es obligatoria"), numeric_equivalence: Yup.number().typeError("Debe ser un número").required("La equivalencia numérica es obligatoria"), is_active: Yup.boolean() });
