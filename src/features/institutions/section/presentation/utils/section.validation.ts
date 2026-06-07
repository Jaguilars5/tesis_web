import * as Yup from "yup";

export const sectionSchema = Yup.object({
  parallel: Yup.string()
    .min(1, "El paralelo es obligatorio")
    .max(255, "Maximo 255 caracteres")
    .required("El paralelo es obligatorio"),
  capacity: Yup.number()
    .integer("Debe ser un numero entero")
    .min(1, "La capacidad minima es 1")
    .required("La capacidad es obligatoria"),
  school_year: Yup.number()
    .required("El ano escolar es obligatorio"),
  academic_grade: Yup.number()
    .nullable(),
  is_active: Yup.boolean(),
});
