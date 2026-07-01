import type {
  GradeRosterEntryT,
  GradingContextT,
  TakeByActivitySaveResultT,
} from "./gradebook.types";

export function getTodayLocal(): string {
  return new Date().toISOString().slice(0, 10);
}

export function clampNumericScore(
  score: number,
  maxScore: number | null,
): number {
  const clamped = Math.max(0, score);
  if (maxScore !== null) {
    return Math.min(clamped, maxScore);
  }
  return clamped;
}

export function getNumericScoreError(
  score: number | null,
  maxScore: number | null,
): string | null {
  if (score === null) return null;
  if (score < 0) return "La nota no puede ser menor a 0";
  if (maxScore !== null && score > maxScore) {
    return `La nota no puede ser mayor a ${maxScore}`;
  }
  return null;
}

export function hasInvalidRosterScores(
  roster: GradeRosterEntryT[],
  maxScore: number | null,
): boolean {
  return roster.some(
    (entry) =>
      entry.numericScore !== null &&
      getNumericScoreError(entry.numericScore, maxScore) !== null,
  );
}

export function isDueDatePassed(
  ctx: GradingContextT,
  today: string = getTodayLocal(),
): boolean {
  return today > ctx.dueDate;
}

export function isPeriodOpen(
  ctx: GradingContextT,
  today: string = getTodayLocal(),
): boolean {
  if (ctx.gradesLocked) return false;
  return today >= ctx.periodStartDate && today <= ctx.periodEndDate;
}

export type GradingLockReasonT =
  | "period_closed"
  | "outside_period"
  | "due_date_passed"
  | null;

export function getGlobalGradingLockReason(
  ctx: GradingContextT | null,
  today: string = getTodayLocal(),
): GradingLockReasonT {
  if (!ctx) return null;
  if (ctx.gradesLocked) return "period_closed";
  if (today < ctx.periodStartDate || today > ctx.periodEndDate) {
    return "outside_period";
  }
  return null;
}

export function canEditStudentScore(
  entry: GradeRosterEntryT,
  ctx: GradingContextT | null,
  today: string = getTodayLocal(),
): { allowed: boolean; reason: string | null } {
  const globalReason = getGlobalGradingLockReason(ctx, today);
  if (globalReason === "period_closed") {
    return {
      allowed: false,
      reason: "El período académico está cerrado para calificaciones.",
    };
  }
  if (globalReason === "outside_period" && ctx) {
    return {
      allowed: false,
      reason: `Solo se pueden calificar dentro del período (${ctx.periodStartDate} — ${ctx.periodEndDate}).`,
    };
  }
  if (
    ctx &&
    entry.originalNumericScore !== null &&
    isDueDatePassed(ctx, today)
  ) {
    return {
      allowed: false,
      reason: `La fecha de entrega (${ctx.dueDate}) ya pasó. Extienda el plazo para modificar notas ya registradas.`,
    };
  }
  return { allowed: true, reason: null };
}

export function getGradingStatusMessage(
  ctx: GradingContextT | null,
  roster: GradeRosterEntryT[],
  today: string = getTodayLocal(),
): string | null {
  if (!ctx) return null;

  const globalReason = getGlobalGradingLockReason(ctx, today);
  if (globalReason === "period_closed") {
    return `El período «${ctx.periodName}» está cerrado para calificaciones.`;
  }
  if (globalReason === "outside_period") {
    return `Hoy está fuera del período académico «${ctx.periodName}» (${ctx.periodStartDate} — ${ctx.periodEndDate}).`;
  }

  const lockedRegistered = roster.filter(
    (e) =>
      e.originalNumericScore !== null &&
      !canEditStudentScore(e, ctx, today).allowed,
  ).length;

  if (isDueDatePassed(ctx, today) && lockedRegistered > 0) {
    return `La fecha de entrega (${ctx.dueDate}) ya pasó. Puede registrar notas nuevas, pero ${lockedRegistered} estudiante(s) con nota registrada no se pueden modificar hasta extender el plazo.`;
  }

  if (isDueDatePassed(ctx, today)) {
    return `La fecha de entrega (${ctx.dueDate}) ya pasó. Aún puede registrar la primera nota de cada estudiante dentro del período.`;
  }

  return `Período «${ctx.periodName}» · entrega hasta ${ctx.dueDate}.`;
}

export function rosterHasChanges(roster: GradeRosterEntryT[]): boolean {
  return roster.some(
    (e) =>
      e.numericScore !== e.originalNumericScore ||
      e.teacherObservation !== e.originalTeacherObservation,
  );
}

export function formatSaveErrors(result: TakeByActivitySaveResultT): string {
  if (!result.errors?.length) return "";
  return result.errors
    .map((e) => `Fila ${e.index + 1}: ${e.error}`)
    .join(" ");
}

export function isPartialSaveResult(
  data: unknown,
): data is TakeByActivitySaveResultT {
  return (
    typeof data === "object" &&
    data !== null &&
    ("errors" in data || "created" in data)
  );
}
