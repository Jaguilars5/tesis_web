const ISO_DAY_LABELS: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

export const getIsoWeekday = (dateStr: string): number | null => {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const jsDay = date.getDay();
  return jsDay === 0 ? 7 : jsDay;
};

export const getDayLabel = (isoDay: number): string =>
  ISO_DAY_LABELS[isoDay] ?? "";

export const formatAllowedDays = (days: number[]): string =>
  [...days]
    .sort((a, b) => a - b)
    .map(getDayLabel)
    .filter(Boolean)
    .join(", ");

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayLocal = (): string => toIsoDate(new Date());

const formatDmy = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
};

export interface ValidDateOptionT {
  value: string;
  label: string;
}

/**
 * Genera las fechas válidas para tomar asistencia: todas las fechas dentro del
 * rango del período cuyo día de la semana (ISO) esté en `allowedDays`, sin
 * superar la fecha de hoy. Se devuelven de la más reciente a la más antigua.
 */
export const buildValidDateOptions = (
  startDate: string,
  endDate: string,
  allowedDays: number[],
): ValidDateOptionT[] => {
  if (!startDate || !endDate || allowedDays.length === 0) return [];

  const start = new Date(`${startDate}T00:00:00`);
  const periodEnd = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(periodEnd.getTime())) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = periodEnd < today ? periodEnd : today;

  const allowed = new Set(allowedDays);
  const options: ValidDateOptionT[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const jsDay = cursor.getDay();
    const isoDay = jsDay === 0 ? 7 : jsDay;
    if (allowed.has(isoDay)) {
      options.push({
        value: toIsoDate(cursor),
        label: `${getDayLabel(isoDay)}, ${formatDmy(cursor)}`,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return options.reverse();
};

const parseTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
};

const getCurrentTimeMinutes = (now = new Date()): number =>
  now.getHours() * 60 + now.getMinutes();

const formatTimeRange = (startTime: string, endTime: string): string =>
  `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;

export type ScheduleWindowLockReasonT =
  | "before_class"
  | "after_class"
  | "past_registered"
  | null;

export function getScheduleWindowLockReason(
  ctx: { startTime: string; endTime: string; attendanceDate: string } | null,
  today: string = getTodayLocal(),
  now = new Date(),
): ScheduleWindowLockReasonT {
  if (!ctx) return null;

  const { attendanceDate, startTime, endTime } = ctx;
  if (attendanceDate > today) return null;

  if (attendanceDate < today) {
    return "past_registered";
  }

  const currentMinutes = getCurrentTimeMinutes(now);
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (currentMinutes < startMinutes) return "before_class";
  if (currentMinutes > endMinutes) return "after_class";
  return null;
}

export function canEditAttendanceStatus(
  entry: {
    originalAttendanceStatusId: number | null;
    attendanceStatusId: number | null;
    absenceTypeId: number | null;
    originalAbsenceTypeId: number | null;
  },
  ctx: { startTime: string; endTime: string; attendanceDate: string } | null,
  today: string = getTodayLocal(),
  now = new Date(),
): { allowed: boolean; reason: string | null } {
  if (!ctx) return { allowed: true, reason: null };

  const timeLabel = formatTimeRange(ctx.startTime, ctx.endTime);
  const lockReason = getScheduleWindowLockReason(ctx, today, now);
  const hasRegistered = entry.originalAttendanceStatusId !== null;

  if (lockReason === "before_class") {
    return {
      allowed: false,
      reason: `La asistencia solo puede registrarse durante el horario de clase (${timeLabel}). La clase aún no ha comenzado.`,
    };
  }

  if (lockReason === "past_registered" && hasRegistered) {
    return {
      allowed: false,
      reason:
        "No se puede modificar asistencia ya registrada de un día anterior.",
    };
  }

  if (lockReason === "after_class" && hasRegistered) {
    return {
      allowed: false,
      reason: `El horario de clase (${timeLabel}) ya finalizó. No puede modificar asistencias ya registradas.`,
    };
  }

  return { allowed: true, reason: null };
}

export function isAttendanceStatusChanging(
  entry: {
    originalAttendanceStatusId: number | null;
    attendanceStatusId: number | null;
    absenceTypeId: number | null;
    originalAbsenceTypeId: number | null;
  },
): boolean {
  if (entry.attendanceStatusId !== entry.originalAttendanceStatusId) {
    return true;
  }
  if (entry.absenceTypeId !== entry.originalAbsenceTypeId) {
    return true;
  }
  return false;
}

export function getScheduleWindowMessage(
  ctx: { startTime: string; endTime: string; attendanceDate: string } | null,
  roster: {
    originalAttendanceStatusId: number | null;
    attendanceStatusId: number | null;
    absenceTypeId: number | null;
    originalAbsenceTypeId: number | null;
  }[],
  today: string = getTodayLocal(),
  now = new Date(),
): string | null {
  if (!ctx) return null;

  const timeLabel = formatTimeRange(ctx.startTime, ctx.endTime);
  const lockReason = getScheduleWindowLockReason(ctx, today, now);

  if (lockReason === "before_class") {
    return `Horario de clase: ${timeLabel}. La clase aún no ha comenzado; no puede registrar asistencia todavía.`;
  }

  if (lockReason === "after_class") {
    const lockedCount = roster.filter(
      (entry) =>
        entry.originalAttendanceStatusId !== null &&
        !canEditAttendanceStatus(entry, ctx, today, now).allowed,
    ).length;
    if (lockedCount > 0) {
      return `El horario (${timeLabel}) ya finalizó. Puede registrar asistencia por primera vez, pero ${lockedCount} estudiante(s) con registro previo no se pueden modificar.`;
    }
    return `El horario (${timeLabel}) ya finalizó. Aún puede registrar la primera asistencia de cada estudiante.`;
  }

  if (lockReason === "past_registered") {
    const lockedCount = roster.filter(
      (entry) =>
        entry.originalAttendanceStatusId !== null &&
        !canEditAttendanceStatus(entry, ctx, today, now).allowed,
    ).length;
    if (lockedCount > 0) {
      return `Fecha anterior (${ctx.attendanceDate}). Puede registrar asistencia nueva, pero ${lockedCount} estudiante(s) con registro previo no se pueden modificar.`;
    }
    return `Fecha anterior (${ctx.attendanceDate}). Puede registrar la primera asistencia de cada estudiante.`;
  }

  return `Horario de clase: ${timeLabel}. Puede registrar y modificar asistencia durante el bloque.`;
}
