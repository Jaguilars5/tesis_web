import * as Yup from "yup";
export const promotionStatusSchema = Yup.object({
  code: Yup.string().required("El código es obligatorio"),
  name: Yup.string().required("El nombre es obligatorio"),
  description: Yup.string(),
  is_active: Yup.boolean(),
  order: Yup.number().integer().min(0),
});
