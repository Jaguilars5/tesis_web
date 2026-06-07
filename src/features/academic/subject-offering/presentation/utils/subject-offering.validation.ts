import * as Yup from "yup";

export const subjectOfferingSchema = Yup.object({
  school_year: Yup.number().required("El año escolar es obligatorio"),
  section: Yup.number().required("La sección es obligatoria"),
  subject_academic_config: Yup.number().required("La configuración académica es obligatoria"),
  is_active: Yup.boolean(),
});
