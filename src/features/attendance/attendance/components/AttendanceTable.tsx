import { Eye, Pencil } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { format as fechaFormat } from "fecha";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  AttendanceListParamsT,
  AttendanceOrderingT,
  AttendanceT,
} from "../attendance.types";

const ORDERING_OPTIONS: { label: string; value: AttendanceOrderingT }[] = [
  { label: "Fecha (reciente)", value: "-attendance_date" },
  { label: "Fecha (antiguo)", value: "attendance_date" },
];

type AttendanceTableProps = {
  attendances: AttendanceT[];
  isLoading: boolean;
  loadAttendances: (params?: AttendanceListParamsT) => void;
  onEdit: (attendance: AttendanceT) => void;
  onView: (attendance: AttendanceT) => void;
};

export const AttendanceTable = ({
  attendances,
  isLoading,
  loadAttendances,
  onEdit,
  onView,
}: AttendanceTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] =
    useState<AttendanceOrderingT>("-attendance_date");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: AttendanceOrderingT;
    }) => {
      loadAttendances({
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search:
          overrides?.search !== undefined
            ? overrides.search
            : search || undefined,
        ordering: overrides?.ordering ?? ordering,
      });
    },
    [loadAttendances, page, pageSize, search, ordering],
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({ page: 1, search: value || undefined });
      }, 400);
    },
    [fetchData],
  );

  const handleOrderingChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newOrdering = e.target.value as AttendanceOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const hasNextPage = attendances.length >= pageSize;

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
          {fechaFormat(new Date(s.attendance_date), "DD/MM/YYYY") ||
            s.attendance_date}
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
          onChange={handleSearchChange}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar asistencias..."
        />
        <select
          value={ordering}
          onChange={handleOrderingChange}
          className="block w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Ordenar por"
        >
          {ORDERING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
        // rowActions={(s) => (
        //   <div className="flex items-center justify-end gap-1">
        //     <button type="button" onClick={() => onView(s)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Ver detalle"><Eye className="size-4" /></button>
        //     <button type="button" onClick={() => onEdit(s)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Editar"><Pencil className="size-4" /></button>
        //   </div>
        // )}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={attendances.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchData({ page: newPage });
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
