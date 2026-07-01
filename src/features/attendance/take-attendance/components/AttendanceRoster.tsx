import React from "react";
import { tableClassname, tableColumnsClassname, tableFirstColumnClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import type { TableColumnProps } from "@shared/components/Table";
import type { RosterEntryT, ScheduleWindowContextT } from "../take-attendance.types";
import { canEditAttendanceStatus } from "../take-attendance.utils";

interface AttendanceRosterProps {
  roster: RosterEntryT[];
  scheduleWindow: ScheduleWindowContextT | null;
  attendanceStatusOptions: { label: string; value: string }[];
  absenceTypeOptions: { label: string; value: string }[];
  updateRosterEntry: (enrollmentId: number, updates: Partial<Omit<RosterEntryT, "enrollmentId" | "studentName">>) => void;
}

export const AttendanceRoster: React.FC<AttendanceRosterProps> = ({
  roster,
  scheduleWindow,
  attendanceStatusOptions,
  absenceTypeOptions,
  updateRosterEntry,
}) => {
  const presentValue = attendanceStatusOptions.find((o) => o.label === "Presente")?.value;

  const columns: TableColumnProps<RosterEntryT>[] = [
    { key: "index", label: "#", className: { th: `w-12 ${tableFirstColumnClassname.th}`, td: "w-12 py-3 pl-4 pr-3 text-sm text-slate-500" }, render: (_, index) => index + 1 },
    { key: "studentName", label: "Estudiante", className: tableColumnsClassname, render: (entry) => <span className="font-semibold text-slate-800">{entry.studentName}</span> },
    {
      key: "status", label: "Estado", className: tableColumnsClassname,
      render: (entry) => {
        const { allowed, reason } = canEditAttendanceStatus(entry, scheduleWindow);
        return (
          <div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {attendanceStatusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`inline-flex items-center gap-1.5 text-sm ${
                    allowed ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  }`}
                >
                  <input
                    type="radio"
                    name={`status-${entry.enrollmentId}`}
                    value={opt.value}
                    checked={entry.attendanceStatusId === Number(opt.value)}
                    disabled={!allowed}
                    title={!allowed ? (reason ?? undefined) : undefined}
                    onChange={() =>
                      updateRosterEntry(entry.enrollmentId, {
                        attendanceStatusId: Number(opt.value),
                        absenceTypeId:
                          opt.label === "Presente" ? null : entry.absenceTypeId,
                      })
                    }
                    className="size-4 border-slate-300 text-primary focus:ring-primary disabled:cursor-not-allowed"
                  />
                  <span className="text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
            {!allowed && reason && (
              <p className="mt-1 text-xs text-amber-700">{reason}</p>
            )}
          </div>
        );
      },
    },
    {
      key: "absenceType", label: "Tipo de Ausencia", className: { th: `w-48 ${tableColumnsClassname.th}`, td: "w-48 px-3 py-2" },
      render: (entry) => {
        const { allowed } = canEditAttendanceStatus(entry, scheduleWindow);
        const showAbsenceType = entry.attendanceStatusId !== null && entry.attendanceStatusId !== Number(presentValue);
        return showAbsenceType ? (
          <CustomSelect
            name={`absence-type-${entry.enrollmentId}`}
            label=""
            value={entry.absenceTypeId ?? ""}
            options={absenceTypeOptions}
            disabled={!allowed}
            onChange={(option) =>
              updateRosterEntry(entry.enrollmentId, {
                absenceTypeId: option.value ? Number(option.value) : null,
              })
            }
            placeholder="Sin tipo"
            className={selectClassname}
          />
        ) : <span className="text-sm text-slate-400">—</span>;
      },
    },
    {
      key: "observation", label: "Observaciones", className: { th: `w-48 ${tableColumnsClassname.th}`, td: "w-48 px-3 py-2" },
      render: (entry) => (
        <CustomInput
          name={`observation-${entry.enrollmentId}`}
          type="text"
          value={entry.observation ?? ""}
          onChange={(e) => updateRosterEntry(entry.enrollmentId, { observation: e.target.value })}
          placeholder="Opcional"
          className={inputClassname}
        />
      ),
    },
  ];

  return (
    <CustomTable<RosterEntryT> data={roster} columns={columns} isLoading={false}
      emptyMessage="No hay estudiantes en esta clase."
      className={{ ...tableClassname, container: "" }} />
  );
};
