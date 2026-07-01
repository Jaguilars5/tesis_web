import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";

import type { TableColumnProps } from "@shared/components/Table";
import type { GradeRosterEntryT, GradingContextT } from "../gradebook.types";
import {
  canEditStudentScore,
  clampNumericScore,
  getNumericScoreError,
} from "../gradebook.utils";

interface GradeScoreInputProps {
  entry: GradeRosterEntryT;
  maxScore: number | null;
  gradingContext: GradingContextT | null;
  updateScore: (enrollmentId: number, numericScore: number | null) => void;
}

const GradeScoreInput: React.FC<GradeScoreInputProps> = ({
  entry,
  maxScore,
  gradingContext,
  updateScore,
}) => {
  const validationError = getNumericScoreError(entry.numericScore, maxScore);
  const { allowed, reason } = canEditStudentScore(entry, gradingContext);
  const isScoreChange =
    entry.numericScore !== entry.originalNumericScore &&
    !(entry.numericScore === null && entry.originalNumericScore === null);
  const disabled = !allowed && (entry.originalNumericScore !== null || isScoreChange);

  const handleChange = (rawValue: string) => {
    if (disabled) return;
    if (rawValue === "") {
      updateScore(entry.enrollmentId, null);
      return;
    }

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return;

    updateScore(entry.enrollmentId, parsed);
  };

  const handleBlur = (rawValue: string) => {
    if (disabled) return;
    if (rawValue === "") return;

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
      updateScore(entry.enrollmentId, null);
      return;
    }

    updateScore(entry.enrollmentId, clampNumericScore(parsed, maxScore));
  };

  const error = validationError ?? (!allowed ? reason : null);

  return (
    <div>
      <input
        type="number"
        min={0}
        max={maxScore ?? undefined}
        step={0.1}
        value={entry.numericScore ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => handleBlur(e.target.value)}
        placeholder="—"
        disabled={disabled}
        title={disabled ? (reason ?? undefined) : undefined}
        aria-invalid={error ? true : undefined}
        className={`block w-24 rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-400"
            : "border-slate-300 focus:border-primary focus:ring-primary"
        }`}
      />
      {error && (
        <p className="mt-1 max-w-48 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

interface GradebookRosterProps {
  roster: GradeRosterEntryT[];
  maxScore: number | null;
  gradingContext: GradingContextT | null;
  updateScore: (enrollmentId: number, numericScore: number | null) => void;
  updateObservation: (enrollmentId: number, observation: string) => void;
}

export const GradebookRoster: React.FC<GradebookRosterProps> = ({
  roster,
  maxScore,
  gradingContext,
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
      className: { th: `w-48 ${tableColumnsClassname.th}`, td: "w-48 px-3 py-2" },
      render: (entry) => (
        <GradeScoreInput
          entry={entry}
          maxScore={maxScore}
          gradingContext={gradingContext}
          updateScore={updateScore}
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
