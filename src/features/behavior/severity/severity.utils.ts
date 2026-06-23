import * as Yup from "yup";
export const severitySchema = Yup.object({ code: Yup.string().required("El código es requerido").max(30, "Máximo 30 caracteres"), name: Yup.string().required("El nombre es requerido").max(100, "Máximo 100 caracteres"), description: Yup.string(), is_active: Yup.boolean() });
