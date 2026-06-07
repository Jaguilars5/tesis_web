import * as Yup from "yup";

export const subjectSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  code: Yup.string().required("El código es obligatorio"),
  is_active: Yup.boolean(),
});
