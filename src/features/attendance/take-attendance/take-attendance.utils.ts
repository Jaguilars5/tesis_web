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
