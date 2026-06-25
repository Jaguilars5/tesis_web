import * as Yup from "yup";
export const academicLevelSchema = Yup.object({
  code: Yup.string().required("El código es obligatorio"),
  name: Yup.string().required("El nombre es obligatorio"),
  description: Yup.string(),
});
