import * as Yup from "yup";

export const teacherSubjectSectionSchema = Yup.object({
  user: Yup.number()
    .min(1, "El docente es obligatorio")
    .required("El docente es obligatorio"),
  subject_offering: Yup.number()
    .min(1, "La oferta de materia es obligatoria")
    .required("La oferta de materia es obligatoria"),
  is_active: Yup.boolean(),
});
