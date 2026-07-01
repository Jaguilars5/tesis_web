import { AlertTriangle, CalendarClock, Lock } from "lucide-react";

import type { GradingContextT } from "../gradebook.types";
import {
  getGlobalGradingLockReason,
  getGradingStatusMessage,
  isDueDatePassed,
} from "../gradebook.utils";

import type { GradeRosterEntryT } from "../gradebook.types";

interface GradebookGradingBannerProps {
  gradingContext: GradingContextT | null;
  roster: GradeRosterEntryT[];
  onExtendDueDate: () => void;
}

export const GradebookGradingBanner: React.FC<GradebookGradingBannerProps> = ({
  gradingContext,
  roster,
  onExtendDueDate,
}) => {
  if (!gradingContext) return null;

  const message = getGradingStatusMessage(gradingContext, roster);
  const globalLock = getGlobalGradingLockReason(gradingContext);
  const duePassed = isDueDatePassed(gradingContext);
  const hasLockedRegistered = roster.some(
    (e) =>
      e.originalNumericScore !== null &&
      duePassed &&
      globalLock === null,
  );

  const isError = globalLock !== null;
  const isWarning = !isError && duePassed;

  if (!message) return null;

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : isWarning
            ? "border-amber-200 bg-amber-50 text-amber-900"
            : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <div className="flex items-start gap-2.5">
        {isError ? (
          <Lock className="mt-0.5 size-4 shrink-0" />
        ) : isWarning ? (
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        ) : (
          <CalendarClock className="mt-0.5 size-4 shrink-0" />
        )}
        <div>
          <p className="font-semibold">
            {gradingContext.activityTitle}
          </p>
          <p className="mt-0.5">{message}</p>
        </div>
      </div>
      {hasLockedRegistered && !globalLock && (
        <button
          type="button"
          onClick={onExtendDueDate}
          className="shrink-0 rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
        >
          Extender fecha de entrega
        </button>
      )}
    </div>
  );
};
