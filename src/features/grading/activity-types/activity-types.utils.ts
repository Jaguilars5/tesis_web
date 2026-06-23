import * as Yup from "yup";
export const activityTypeSchema = Yup.object({ code: Yup.string().required("El código es obligatorio"), name: Yup.string().required("El nombre es obligatorio"), description: Yup.string(), is_active: Yup.boolean() });
