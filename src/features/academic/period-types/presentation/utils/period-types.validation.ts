import * as Yup from "yup";
export const periodTypeSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  is_active: Yup.boolean(),
});
