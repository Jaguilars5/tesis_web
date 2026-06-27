import * as Yup from "yup";

export const subjectAcademicConfigSchema = Yup.object({
  subject: Yup.number()
    .min(1, "La materia es obligatoria")
    .required("La materia es obligatoria"),
  academic_grade: Yup.number()
    .min(1, "El grado academico es obligatorio")
    .required("El grado academico es obligatorio"),
  weekly_hours: Yup.number()
    .min(1, "Debe ser al menos 1 hora")
    .required("Las horas semanales son obligatorias"),
  is_required: Yup.boolean(),
  is_active: Yup.boolean(),
});
