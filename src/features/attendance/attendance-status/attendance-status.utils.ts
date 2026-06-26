import * as Yup from "yup";

export const attendanceStatusSchema = Yup.object({
  code: Yup.string().required("El código es requerido").max(10, "Máximo 10 caracteres"),
  name: Yup.string().required("El nombre es requerido").max(100, "Máximo 100 caracteres"),
  description: Yup.string(),
});
