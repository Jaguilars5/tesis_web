import * as Yup from "yup";

export const subjectAcademicConfigSchema = Yup.object({
  subject: Yup.number().required("La materia es obligatoria"),
  academic_grade: Yup.number().required("El grado academico es obligatorio"),
  weekly_hours: Yup.number().required("Las horas semanales son obligatorias").min(1, "Debe ser al menos 1"),
  pedagogical_order: Yup.number().required("El orden pedagogico es obligatorio").min(1, "Debe ser al menos 1"),
  is_required: Yup.boolean(),
  is_active: Yup.boolean(),
});
