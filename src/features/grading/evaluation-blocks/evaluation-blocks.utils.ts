import * as Yup from "yup";

export const evaluationBlockSchema = Yup.object({
  code: Yup.string().max(50, "El código no debe exceder 50 caracteres"),
  name: Yup.string()
    .max(100, "El nombre no debe exceder 100 caracteres")
    .required("El nombre es obligatorio"),
  weight_percentage: Yup.number()
    .min(0, "El porcentaje debe ser mayor o igual a 0")
    .max(100, "El porcentaje no debe exceder 100")
    .required("El porcentaje es obligatorio"),
  academic_period: Yup.number()
    .min(1, "Debe seleccionar un período académico")
    .required("El período académico es obligatorio"),
  subject_offering: Yup.number()
    .min(1, "Debe seleccionar una oferta de materia")
    .required("La oferta de materia es obligatoria"),
  block_type: Yup.string().nullable(),
});
