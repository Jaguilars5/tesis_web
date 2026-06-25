import * as Yup from "yup";
export const academicSubLevelSchema = Yup.object({
  code: Yup.string().required("El código es obligatorio"),
  name: Yup.string().required("El nombre es obligatorio"),
  description: Yup.string(),
  academic_level: Yup.number().required("El nivel académico es obligatorio"),
});
