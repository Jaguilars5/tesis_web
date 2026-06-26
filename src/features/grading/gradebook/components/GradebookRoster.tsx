import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";

import type { TableColumnProps } from "@shared/components/Table";
import type { GradeRosterEntryT } from "../gradebook.types";

interface GradebookRosterProps {
  roster: GradeRosterEntryT[];
  maxScore: number | null;
  updateScore: (enrollmentId: number, numericScore: number | null) => void;
  updateObservation: (enrollmentId: number, observation: string) => void;
}

export const GradebookRoster: React.FC<GradebookRosterProps> = ({
  roster,
  maxScore,
  updateScore,
  updateObservation,
}) => {
  const columns: TableColumnProps<GradeRosterEntryT>[] = [
    {
      key: "index",
      label: "#",
      className: {
        th: `w-12 ${tableFirstColumnClassname.th}`,
        td: "w-12 py-3 pl-4 pr-3 text-sm text-slate-500",
      },
      render: (_, index) => index + 1,
    },
    {
      key: "studentName",
      label: "Estudiante",
      className: tableColumnsClassname,
      render: (entry) => (
        <span className="font-semibold text-slate-800">{entry.studentName}</span>
      ),
    },
    {
      key: "numericScore",
      label: maxScore !== null ? `Nota (máx. ${maxScore})` : "Nota",
      className: { th: `w-40 ${tableColumnsClassname.th}`, td: "w-40 px-3 py-2" },
      render: (entry) => (
        <input
          type="number"
          min={0}
          max={maxScore ?? undefined}
          step={0.1}
          value={entry.numericScore ?? ""}
          onChange={(e) => updateScore(entry.enrollmentId, e.target.value === "" ? null : Number(e.target.value))}
          placeholder="—"
          className="block w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ),
    },
    {
      key: "teacherObservation",
      label: "Observación",
      className: tableColumnsClassname,
      render: (entry) => (
        <input
          type="text"
          value={entry.teacherObservation ?? ""}
          onChange={(e) => updateObservation(entry.enrollmentId, e.target.value)}
          placeholder="Opcional"
          className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ),
    },
  ];

  return (
    <CustomTable<GradeRosterEntryT>
      data={roster}
      columns={columns}
      isLoading={false}
      emptyMessage="No hay estudiantes matriculados en esta clase."
      className={{ ...tableClassname, container: "" }}
    />
  );
};
