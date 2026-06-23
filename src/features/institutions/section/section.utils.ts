import * as Yup from "yup";
export const sectionSchema = Yup.object({ parallel: Yup.string().required("El paralelo es obligatorio"), school_year: Yup.number().required("El año escolar es obligatorio"), academic_grade: Yup.number().required("El grado académico es obligatorio"), is_active: Yup.boolean() });
