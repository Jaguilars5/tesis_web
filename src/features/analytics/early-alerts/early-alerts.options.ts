import { useAcademicPeriodOptions } from "@shared/hooks/useAcademicPeriodOptions";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";

export const attendedOptions: SelectOptionT[] = [
  { label: "Pendiente", value: "false" },
  { label: "Atendida", value: "true" },
];

export const urgencyOptions: SelectOptionT[] = [
  { label: "Baja", value: "low" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "high" },
  { label: "Crítica", value: "critical" },
];

export const alertTypeOptions: SelectOptionT[] = [
  { label: "Baja Asistencia", value: "low_attendance" },
  { label: "Calificaciones Bajas", value: "failing_grades" },
  { label: "Problemas de Conducta", value: "behavioral" },
  { label: "Riesgo de Deserción", value: "dropout_risk" },
  { label: "Problemas Socioemocionales", value: "socioemotional" },
];

export const useEarlyAlertFilterCatalogs = () => {
  const { academicPeriodOptions } = useAcademicPeriodOptions();
  return { academicPeriodOptions };
};
