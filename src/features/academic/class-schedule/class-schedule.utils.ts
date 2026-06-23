import * as Yup from "yup";

import type { ClassScheduleT } from "./class-schedule.types";

export const classScheduleSchema = Yup.object({
  teacher_subject_section: Yup.number()
    .min(1, "Debe seleccionar una asignación")
    .required("La asignación docente-materia es obligatoria"),
  day_of_week: Yup.number()
    .min(1, "Debe seleccionar un día")
    .max(7, "Día inválido")
    .required("El día de la semana es obligatorio"),
  start_time: Yup.string().required("La hora de inicio es obligatoria"),
  end_time: Yup.string()
    .required("La hora de fin es obligatoria")
    .test(
      "end_after_start",
      "La hora de fin debe ser posterior a la hora de inicio",
      function (value) {
        const { start_time } = this.parent as { start_time?: string };
        if (!value || !start_time) return true;
        return value > start_time;
      },
    ),
  is_active: Yup.boolean(),
});

export const formatDayOfWeek = (item: ClassScheduleT): string =>
  item.day_of_week_name;

export const formatTimeRange = (item: ClassScheduleT): string =>
  `${item.start_time} - ${item.end_time}`;
