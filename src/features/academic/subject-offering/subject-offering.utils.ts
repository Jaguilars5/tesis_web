import * as Yup from "yup";

export const subjectOfferingSchema = Yup.object({
  school_year: Yup.number()
    .min(1, "El año escolar es obligatorio")
    .required("El año escolar es obligatorio"),
  section: Yup.number()
    .min(1, "La seccion es obligatoria")
    .required("La seccion es obligatoria"),
  subject_academic_config: Yup.number()
    .min(1, "La configuracion academica es obligatoria")
    .required("La configuracion academica es obligatoria"),
});
