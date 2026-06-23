import * as Yup from "yup";
export const evaluationBlockSchema = Yup.object({ code: Yup.string(), name: Yup.string().required("El nombre es obligatorio"), weight_percentage: Yup.number().min(0).max(100).required("El porcentaje es obligatorio"), academic_period: Yup.number().required("El período académico es obligatorio"), tipo: Yup.string().nullable(), is_active: Yup.boolean() });
