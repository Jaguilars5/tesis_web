import * as Yup from "yup";

export const evaluativeActivitySchema = Yup.object({
  title: Yup.string().required("El título es obligatorio"),
  teacher_subject_section: Yup.number().required(
    "La sección docente-materia es obligatoria",
  ),
  activity_type: Yup.number().nullable(),
  max_score: Yup.string().required("La puntuación máxima es obligatoria"),
  due_date: Yup.string().required("La fecha de vencimiento es obligatoria"),
  block_component: Yup.number()
    .min(1)
    .required("El bloque de evaluación es obligatorio"),
  internal_weight: Yup.string().required("La ponderación es obligatoria"),
});
