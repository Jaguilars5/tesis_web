import * as Yup from "yup";

export const conductIncidentSchema = Yup.object({
  incident_type: Yup.number()
    .nullable()
    .required("El tipo de incidente es requerido"),
  severity: Yup.number().nullable().required("La severidad es requerida"),
  academic_period: Yup.number()
    .nullable()
    .required("El período académico es requerido"),
  enrollment: Yup.number().nullable().required("La matrícula es requerida"),
  incident_date: Yup.string().required("La fecha del incidente es requerida"),
  description: Yup.string(),
  actions_taken: Yup.string(),
  family_notified: Yup.boolean(),
});
