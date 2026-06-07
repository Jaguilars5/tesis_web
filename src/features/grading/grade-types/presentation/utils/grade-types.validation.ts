import * as Yup from "yup";
export const gradeTypeSchema = Yup.object({
  code: Yup.string().required("El código es obligatorio"),
  name: Yup.string().required("El nombre es obligatorio"),
  description: Yup.string(),
  is_active: Yup.boolean(),
  order: Yup.number().integer().min(0),
  applicable_subniveles: Yup.array().of(Yup.number()),
});
