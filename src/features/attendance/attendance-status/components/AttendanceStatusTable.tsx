import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomSelect, SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  AttendanceStatusListParamsT,
  AttendanceStatusOrderingT,
  AttendanceStatusT,
} from "../attendance-status.types";

const OrderingOptions: { label: string; value: AttendanceStatusOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Código (A-Z)", value: "code" },
  { label: "Código (Z-A)", value: "-code" },
];

interface AttendanceStatusTableProps {
  attendanceStatuses: AttendanceStatusT[];
  isLoading: boolean;
  loadAttendanceStatuses: (params?: AttendanceStatusListParamsT) => void;
  onEdit: (s: AttendanceStatusT) => void;
  onView: (s: AttendanceStatusT) => void;
  onDelete: (s: AttendanceStatusT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const AttendanceStatusTable: React.FC<AttendanceStatusTableProps> = ({
  attendanceStatuses,
  isLoading,
  loadAttendanceStatuses,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<AttendanceStatusOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (params?: AttendanceStatusListParamsT) => {
      loadAttendanceStatuses(params);
    },
    [loadAttendanceStatuses],
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
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

  const handleOrdering = useCallback(
    (value: AttendanceStatusOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, ordering: value });
    },
    [fetchData],
  );

  const hasNextPage = attendanceStatuses.length >= pageSize;

  const columns: TableColumnProps<AttendanceStatusT>[] = [
    {
      key: "name",
      label: "Nombre",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.name}</span>,
    },
    {
      key: "description",
      label: "Descripción",
      className: tableColumnsClassname,
      render: (s) => (
        <span className="line-clamp-1 max-w-60 text-ellipsis">
          {s.description || "—"}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (s) =>
        s.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
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
          placeholder="Filtrar estados..."
        />
        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as AttendanceStatusOrderingT)
          }
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<AttendanceStatusT>
        data={attendanceStatuses}
        columns={columns}
        isLoading={isLoading && attendanceStatuses.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron estados con los filtros aplicados"
            : "No se encontraron estados de asistencia"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando estados..."
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
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(s)}
                className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Desactivar"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        )}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={attendanceStatuses.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(np) => {
          setPage(np);
          fetchData({ page: np });
        }}
        onPageSizeChange={(ns) => {
          setPageSize(ns);
          setPage(1);
          fetchData({ page: 1, pageSize: ns });
        }}
      />
    </div>
  );
};
