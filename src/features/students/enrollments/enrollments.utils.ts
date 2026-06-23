import * as Yup from "yup"; export const enrollmentSchema = Yup.object({ section: Yup.number().min(1, "Seleccione un curso").required("El curso es obligatorio"), enrollment_status: Yup.string().required("El estado es obligatorio"), is_repeat: Yup.boolean(), student_condition: Yup.string().nullable(), cellphone: Yup.string().nullable(), email: Yup.string().email("Correo inválido").nullable(), observations: Yup.string().nullable(), is_active: Yup.boolean() });
export const ENROLLMENT_STATUS_OPTIONS = [
  {
    label: "Activo",
    value: "ACT",
    badge: "default" as const,
    dot: "bg-emerald-500",
  },
  {
    label: "Retirado",
    value: "WITHDRAWN",
    badge: "outline" as const,
    dot: "bg-slate-400",
  },
  {
    label: "Egresado",
    value: "GRADUATED",
    badge: "secondary" as const,
    dot: "bg-blue-500",
  },
];
export const getStatusConfig = (status: string) =>
  ENROLLMENT_STATUS_OPTIONS.find((o) => o.value === status) ?? {
    label: status,
    value: status,
    badge: "outline" as const,
    dot: "bg-slate-400",
  };
export const formatDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("es-EC") : "—";
