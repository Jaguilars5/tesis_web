import { tableClassname, tableColumnsClassname, tableFirstColumnClassname } from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";
import type { TableColumnProps } from "@shared/components/Table";
import type { RosterEntryT } from "../take-attendance.types";

interface AttendanceRosterProps {
  roster: RosterEntryT[];
  attendanceStatusOptions: { label: string; value: string }[];
  absenceTypeOptions: { label: string; value: string }[];
  updateRosterEntry: (enrollmentId: number, updates: Partial<Omit<RosterEntryT, "enrollmentId" | "studentName">>) => void;
}

export const AttendanceRoster = ({ roster, attendanceStatusOptions, absenceTypeOptions, updateRosterEntry }: AttendanceRosterProps) => {
  const presentValue = attendanceStatusOptions.find((o) => o.label === "Presente")?.value;

  const columns: TableColumnProps<RosterEntryT>[] = [
    { key: "index", label: "#", className: { th: `w-12 ${tableFirstColumnClassname.th}`, td: "w-12 py-3 pl-4 pr-3 text-sm text-slate-500" }, render: (_, index) => index + 1 },
    { key: "studentName", label: "Estudiante", className: tableColumnsClassname, render: (entry) => <span className="font-semibold text-slate-800">{entry.studentName}</span> },
    {
      key: "status", label: "Estado", className: tableColumnsClassname,
      render: (entry) => (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {attendanceStatusOptions.map((opt) => (
            <label key={opt.value} className="inline-flex cursor-pointer items-center gap-1.5 text-sm">
              <input type="radio" name={`status-${entry.enrollmentId}`} value={opt.value}
                checked={entry.attendanceStatusId === Number(opt.value)}
                onChange={() => updateRosterEntry(entry.enrollmentId, {
                  attendanceStatusId: Number(opt.value),
                  absenceTypeId: opt.label === "Presente" ? null : entry.absenceTypeId,
                })}
                className="size-4 border-slate-300 text-primary focus:ring-primary" />
              <span className="text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      key: "absenceType", label: "Tipo de Ausencia", className: { th: `w-48 ${tableColumnsClassname.th}`, td: "w-48 px-3 py-2" },
      render: (entry) => {
        const showAbsenceType = entry.attendanceStatusId !== null && entry.attendanceStatusId !== Number(presentValue);
        return showAbsenceType ? (
          <select value={entry.absenceTypeId ?? ""}
            onChange={(e) => updateRosterEntry(entry.enrollmentId, { absenceTypeId: e.target.value ? Number(e.target.value) : null })}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary">
            <option value="">Sin tipo</option>
            {absenceTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ) : <span className="text-sm text-slate-400">—</span>;
      },
    },
    {
      key: "observation", label: "Observaciones", className: { th: `w-48 ${tableColumnsClassname.th}`, td: "w-48 px-3 py-2" },
      render: (entry) => (
        <input type="text" value={entry.observation ?? ""}
          onChange={(e) => updateRosterEntry(entry.enrollmentId, { observation: e.target.value })}
          placeholder="Opcional"
          className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary" />
      ),
    },
  ];

  return (
    <CustomTable<RosterEntryT> data={roster} columns={columns} isLoading={false}
      emptyMessage="No hay estudiantes en esta clase."
      className={{ ...tableClassname, container: "" }} />
  );
};
