import * as Yup from "yup";

export const projectNoteSchema = Yup.object({
  product_score: Yup.number().min(0).max(10).required("La nota del producto es obligatoria"),
  presentation_score: Yup.number().min(0).max(10).required("La nota de exposición es obligatoria"),
  final_score: Yup.number().min(0).max(10).required("La nota final es obligatoria"),
  observation: Yup.string().nullable(),
  sync_status: Yup.string().oneOf(["PENDIENTE", "SINCRONIZADO", "ERROR"]),
  enrollment: Yup.number().required("La matrícula es obligatoria"),
  interdisciplinary_project: Yup.number().required("El proyecto interdisciplinario es obligatorio"),
});
