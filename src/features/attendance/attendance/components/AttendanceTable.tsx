import { Eye, Pencil } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { format as fechaFormat } from "fecha";
import { CustomSelect, SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  AttendanceListParamsT,
  AttendanceOrderingT,
  AttendanceT,
} from "../attendance.types";

const OrderingOptions: { label: string; value: AttendanceOrderingT }[] = [
  { label: "Fecha (reciente)", value: "-attendance_date" },
  { label: "Fecha (antiguo)", value: "attendance_date" },
  { label: "Creado (reciente)", value: "-created_at" },
  { label: "Creado (antiguo)", value: "created_at" },
];

interface AttendanceTableProps {
  attendances: AttendanceT[];
  totalCount: number;
  isLoading: boolean;
  loadAttendances: (params?: AttendanceListParamsT) => void;
  onEdit: (attendance: AttendanceT) => void;
  onView: (attendance: AttendanceT) => void;
  canEdit?: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendances,
  totalCount,
  isLoading,
  loadAttendances,
  onEdit,
  onView,
  canEdit = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<AttendanceOrderingT>("-attendance_date");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (params?: AttendanceListParamsT) => {
      loadAttendances(params);
    },
    [loadAttendances],
  );

  useEffect(() => {
    fetchData({ page: 1, pageSize });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({ page: 1, pageSize, search: value || undefined });
      }, 400);
    },
    [fetchData, pageSize],
  );

  const handleOrdering = useCallback(
    (value: AttendanceOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, pageSize, ordering: value });
    },
    [fetchData, pageSize],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<AttendanceT>[] = [
    {
      key: "enrollment_name",
      label: "Estudiante",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.enrollment_name}</span>,
    },
    {
      key: "attendance_date",
      label: "Fecha",
      className: tableColumnsClassname,
      render: (s) => (
        <span>
          {fechaFormat(new Date(s.attendance_date), "DD/MM/YYYY") || s.attendance_date}
        </span>
      ),
    },
    {
      key: "attendance_status_name",
      label: "Estado",
      className: tableColumnsClassname,
    },
    {
      key: "teacher_subject_section_name",
      label: "Clase",
      className: tableColumnsClassname,
      render: (s) => (
        <span className="line-clamp-1 max-w-48 text-ellipsis">
          {s.teacher_subject_section_name}
        </span>
      ),
    },
    {
      key: "academic_period_name",
      label: "Período",
      className: tableColumnsClassname,
    },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput
          name="search"
          type="text"
          onChange={handleSearch}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar asistencias..."
        />
        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as AttendanceOrderingT)
          }
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<AttendanceT>
        data={attendances}
        columns={columns}
        isLoading={isLoading && attendances.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron asistencias con los filtros aplicados"
            : "No se encontraron asistencias"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando asistencias..."
        rowActions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(s)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(s)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
          </div>
        )}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalCount}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchData({ page: newPage, pageSize });
        }}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
          fetchData({ page: 1, pageSize: newSize });
        }}
      />
    </div>
  );
};
