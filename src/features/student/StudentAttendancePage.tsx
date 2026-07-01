import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useCallback, useState } from "react";
import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form";
import { CustomTable } from "@shared/components/Table";
import { Pagination } from "@shared/components/Pagination";
import { useStudentAttendance } from "./useStudentAttendance";
import { statusBadge } from "./student.utils";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table/tableProps";

interface RecordRow {
  id: number;
  date: string;
  subject: string;
  status: string;
  statusName: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Presente: <CheckCircle2 className="size-4 text-green-500" />,
  Ausente: <XCircle className="size-4 text-red-500" />,
  Tardanza: <Clock className="size-4 text-amber-500" />,
};

interface StudentAttendancePageProps {
  studentId?: number | null;
  embedded?: boolean;
}

export default function StudentAttendancePage({
  studentId,
  embedded = false,
}: StudentAttendancePageProps = {}) {
  const { records, loading, error } = useStudentAttendance(studentId);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Reset page when filter changes
  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const rows: RecordRow[] = records.map((r) => ({
    id: r.id,
    date: r.attendance_date,
    subject: r.enrollment_name,
    status: r.attendance_status_name,
    statusName: r.attendance_status_name,
  }));

  const filtered = statusFilter ? rows.filter((r) => r.status === statusFilter) : rows;
  const paginatedRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const statusOptions = [
    { label: "Todos", value: "" },
    ...Array.from(new Set(rows.map((r) => r.status))).map((s) => ({ label: s, value: s })),
  ];

  const stats = {
    present: rows.filter((r) => r.status === "Presente").length,
    absent: rows.filter((r) => r.status === "Ausente").length,
    late: rows.filter((r) => r.status === "Tardanza").length,
  };

  const cols: TableColumnProps<RecordRow>[] = [
    {
      key: "date",
      label: "Fecha",
      className: tableFirstColumnClassname,
    },
    {
      key: "subject",
      label: "Materia",
      className: tableColumnsClassname,
    },
    {
      key: "statusName",
      label: "Estado",
      className: tableColumnsClassname,
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${statusBadge(
            r.statusName
          )}`}
        >
          {iconMap[r.statusName] ?? null}
          {r.statusName}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {!embedded && (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Mi Asistencia</h1>
            <p className="mt-1 text-sm text-slate-500">Consulta tu registro de asistencia</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-2xl font-extrabold text-green-600">{stats.present}</p>
          <p className="text-xs font-medium text-green-700">Presentes</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-2xl font-extrabold text-red-600">{stats.absent}</p>
          <p className="text-xs font-medium text-red-700">Ausencias</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">{stats.late}</p>
          <p className="text-xs font-medium text-amber-700">Atrasos</p>
        </div>
      </div>

      <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <CustomSelect
            label=""
            name="status"
            placeholder="Filtrar por estado"
            value={statusFilter}
            onChange={(opt: SelectOptionT) => handleStatusChange(String(opt.value ?? ""))}
            options={statusOptions}
            className={filterSelectClassname}
          />
        </div>

        <CustomTable<RecordRow>
          data={paginatedRows}
          columns={cols}
          isLoading={loading}
          emptyMessage="No se encontraron registros de asistencia"
          className={tableClassname}
          loadingMessage="Cargando asistencia..."
        />

        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={filtered.length}
          hasNextPage={page * pageSize < filtered.length}
          onPageChange={setPage}
          onPageSizeChange={() => {}}
        />
      </div>
    </div>
  );
}
