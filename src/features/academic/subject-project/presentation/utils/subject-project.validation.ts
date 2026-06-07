import * as Yup from "yup";

export const subjectProjectSchema = Yup.object({
  interdisciplinary_project: Yup.number().required("El proyecto es obligatorio"),
  subject_offering: Yup.number().required("La oferta de materia es obligatoria"),
});
