import { Loader2 } from "lucide-react";
import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomSelect } from "@shared/components/Form";
import { CustomTable } from "@shared/components/Table";
import { Pagination } from "@shared/components/Pagination";
import { useStudentGrades, type GradeActivityRow } from "./useStudentGrades";
import { scoreBadge } from "./student.utils";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table/tableProps";

interface StudentGradesPageProps {
  studentId?: number | null;
  embedded?: boolean;
}

export default function StudentGradesPage({
  studentId,
  embedded = false,
}: StudentGradesPageProps = {}) {
  const {
    periodOptions,
    selectedPeriodId,
    setSelectedPeriodId,
    subjectOptions,
    selectedSubject,
    setSelectedSubject,
    activityTypeOptions,
    selectedActivityType,
    setSelectedActivityType,
    activities,
    page,
    pageSize,
    totalPages,
    totalActivities,
    onPageChange,
    loading,
    error,
  } = useStudentGrades(studentId);

  const periodSelectOptions = [
    { label: "Todos los períodos", value: "" },
    ...periodOptions,
  ];
  const subjectSelectOptions = [
    { label: "Todas las materias", value: "" },
    ...subjectOptions,
  ];
  const activityTypeSelectOptions = [
    { label: "Todos los tipos", value: "" },
    ...activityTypeOptions,
  ];

  const percentage = (a: GradeActivityRow): number | null =>
    a.score !== null && a.maxScore > 0 ? (a.score / a.maxScore) * 100 : null;

  const columns: TableColumnProps<GradeActivityRow>[] = [
    {
      key: "title",
      label: "Actividad",
      className: tableFirstColumnClassname,
      render: (a) => <span className="font-medium text-slate-700">{a.title}</span>,
    },
    {
      key: "subjectName",
      label: "Materia",
      className: tableColumnsClassname,
      render: (a) => <span className="text-sm text-slate-500">{a.subjectName}</span>,
    },
    {
      key: "activityTypeName",
      label: "Tipo",
      className: tableColumnsClassname,
      render: (a) => <span className="text-sm text-slate-500">{a.activityTypeName}</span>,
    },
    {
      key: "score",
      label: "Nota",
      className: tableColumnsClassname,
      render: (a) => (
        <span className="font-semibold">
          {a.score !== null ? `${a.score} / ${a.maxScore}` : "—"}
        </span>
      ),
    },
    {
      key: "id",
      label: "%",
      className: tableColumnsClassname,
      render: (a) => {
        const pct = percentage(a);
        return (
          <Badge className={scoreBadge(pct)}>
            {pct !== null ? `${Math.round(pct)}%` : "—"}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {!embedded && (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Mis Calificaciones</h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulta tus notas por período académico, materia y tipo de actividad
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <CustomSelect
            label=""
            name="academic_period"
            placeholder="Todos los períodos"
            value={selectedPeriodId ?? ""}
            onChange={(opt: SelectOptionT) =>
              setSelectedPeriodId(opt.value ? Number(opt.value) : null)
            }
            options={periodSelectOptions}
            className={filterSelectClassname}
          />
          <CustomSelect
            label=""
            name="subject"
            placeholder="Todas las materias"
            value={selectedSubject}
            onChange={(opt: SelectOptionT) =>
              setSelectedSubject(String(opt.value ?? ""))
            }
            options={subjectSelectOptions}
            className={filterSelectClassname}
          />
          <CustomSelect
            label=""
            name="activity_type"
            placeholder="Todos los tipos"
            value={selectedActivityType}
            onChange={(opt: SelectOptionT) =>
              setSelectedActivityType(String(opt.value ?? ""))
            }
            options={activityTypeSelectOptions}
            className={filterSelectClassname}
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-slate-500">Cargando calificaciones...</span>
          </div>
        )}

        {!loading && (
          <>
            <CustomTable<GradeActivityRow>
              columns={columns}
              data={activities}
              isLoading={false}
              emptyMessage="No hay calificaciones registradas"
              className={tableClassname}
            />
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalActivities}
              hasNextPage={page < totalPages}
              onPageChange={onPageChange}
              onPageSizeChange={() => {}}
            />
          </>
        )}
      </div>
    </div>
  );
}
