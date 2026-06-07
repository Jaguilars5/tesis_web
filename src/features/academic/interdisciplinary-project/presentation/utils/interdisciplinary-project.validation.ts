import * as Yup from "yup";

export const interdisciplinaryProjectSchema = Yup.object({
  title: Yup.string()
    .min(1, "El titulo debe tener al menos 1 caracter")
    .max(200, "El titulo no debe exceder 200 caracteres")
    .required("El titulo es obligatorio"),
  description: Yup.string().nullable(),
  start_date: Yup.string().required("La fecha de inicio es obligatoria"),
  delivery_date: Yup.string().required("La fecha de entrega es obligatoria"),
  is_active: Yup.boolean(),
  academic_period: Yup.number().required("El periodo academico es obligatorio"),
});
