import { AlertTriangle, Clock } from "lucide-react";

import type { RosterEntryT, ScheduleWindowContextT } from "../take-attendance.types";
import {
  getScheduleWindowLockReason,
  getScheduleWindowMessage,
} from "../take-attendance.utils";

interface AttendanceScheduleBannerProps {
  scheduleWindow: ScheduleWindowContextT | null;
  roster: RosterEntryT[];
}

export const AttendanceScheduleBanner: React.FC<
  AttendanceScheduleBannerProps
> = ({ scheduleWindow, roster }) => {
  if (!scheduleWindow) return null;

  const message = getScheduleWindowMessage(scheduleWindow, roster);
  const lockReason = getScheduleWindowLockReason(scheduleWindow);
  const isError = lockReason === "before_class";
  const isWarning =
    lockReason === "after_class" || lockReason === "past_registered";

  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : isWarning
            ? "border-amber-200 bg-amber-50 text-amber-900"
            : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {isError || isWarning ? (
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <Clock className="mt-0.5 size-4 shrink-0" />
      )}
      <p>{message}</p>
    </div>
  );
};
