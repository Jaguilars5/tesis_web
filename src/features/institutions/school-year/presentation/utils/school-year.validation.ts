import * as Yup from "yup";

export const schoolYearSchema = Yup.object({
  name: Yup.string()
    .min(4, "El nombre debe tener al menos 4 caracteres")
    .required("El nombre es obligatorio"),
  start_date: Yup.string().required("La fecha de inicio es obligatoria"),
  end_date: Yup.string().required("La fecha de fin es obligatoria"),
  is_active: Yup.boolean(),
});
