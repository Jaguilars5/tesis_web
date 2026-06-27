import * as Yup from "yup";

export const sectionSchema = Yup.object({
  parallel: Yup.string().required("El paralelo es obligatorio"),
  school_year: Yup.number()
    .min(1, "El año escolar es obligatorio")
    .required("El año escolar es obligatorio"),
  academic_grade: Yup.number()
    .min(1, "El grado académico es obligatorio")
    .required("El grado académico es obligatorio"),
  capacity: Yup.number()
    .min(1, "La capacidad es obligatoria")
    .required("La capacidad es obligatoria"),
  code: Yup.string().required("El código es obligatorio"),
});
