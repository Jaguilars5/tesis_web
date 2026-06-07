import * as Yup from "yup";

export const academicPeriodSchema = Yup.object({
  name: Yup.string()
    .min(1, "El nombre debe tener al menos 1 caracter")
    .max(80, "El nombre no debe exceder 80 caracteres")
    .required("El nombre es obligatorio"),
  period_type: Yup.string()
    .oneOf(["REGULAR", "SUPLETORIO", "REFUERZO"], "Tipo de periodo invalido")
    .required("El tipo de periodo es obligatorio"),
  start_date: Yup.string().required("La fecha de inicio es obligatoria"),
  end_date: Yup.string().required("La fecha de fin es obligatoria"),
  is_regular_period: Yup.boolean(),
  school_year: Yup.number().required("El ano escolar es obligatorio"),
  is_active: Yup.boolean(),
});
