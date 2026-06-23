import * as Yup from "yup";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null; };

export const earlyAlertSchema = Yup.object({
  enrollment: Yup.number().min(1, "Debe seleccionar una matrícula").required("La matrícula es obligatoria"),
  academic_period: Yup.number().min(1, "Debe seleccionar un período").required("El período académico es obligatorio"),
  alert_type: Yup.string().nullable(),
  description: Yup.string().max(500, "La descripción no debe exceder 500 caracteres").required("La descripción es obligatoria"),
  urgency_level: Yup.string().nullable(),
  response_actions: Yup.string().max(500, "Las acciones no deben exceder 500 caracteres"),
});

export const markAttendedSchema = Yup.object({
  response_actions: Yup.string().max(500, "Las acciones no deben exceder 500 caracteres").required("Las acciones de respuesta son obligatorias"),
});
