import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  SubjectAcademicConfigListParamsT,
  SubjectAcademicConfigOrderingT,
  SubjectAcademicConfigT,
} from "../subject-academic-config.types";

const ORDERING_OPTIONS: {
  label: string;
  value: SubjectAcademicConfigOrderingT;
}[] = [
  { label: "Horas (asc)", value: "weekly_hours" },
  { label: "Horas (desc)", value: "-weekly_hours" },
];

type SubjectAcademicConfigTableProps = {
  subjectAcademicConfigs: SubjectAcademicConfigT[];
  isLoading: boolean;
  loadSubjectAcademicConfigs: (params?: SubjectAcademicConfigListParamsT) => void;
  onEdit: (config: SubjectAcademicConfigT) => void;
  onView: (config: SubjectAcademicConfigT) => void;
  onDelete: (config: SubjectAcademicConfigT) => void;
};

export const SubjectAcademicConfigTable = ({
  subjectAcademicConfigs,
  isLoading,
  loadSubjectAcademicConfigs,
  onEdit,
  onView,
  onDelete,
}: SubjectAcademicConfigTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] =
    useState<SubjectAcademicConfigOrderingT>("weekly_hours");
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: SubjectAcademicConfigOrderingT;
    }) => {
      loadSubjectAcademicConfigs({
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search:
          overrides?.search !== undefined
            ? overrides.search
            : search || undefined,
        ordering: overrides?.ordering ?? ordering,
      });
    },
    [loadSubjectAcademicConfigs, page, pageSize, search, ordering],
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
      const newOrdering = e.target.value as SubjectAcademicConfigOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const hasNextPage = subjectAcademicConfigs.length >= pageSize;

  const columns: TableColumnProps<SubjectAcademicConfigT>[] = [
    {
      key: "subject_name",
      label: "Materia",
      className: tableFirstColumnClassname,
    },
    {
      key: "academic_grade_name",
      label: "Grado",
      className: tableColumnsClassname,
    },
    {
      key: "weekly_hours",
      label: "Horas",
      className: tableColumnsClassname,
    },
    {
      key: "is_required",
      label: "Obligatorio",
      className: tableColumnsClassname,
      render: (c) =>
        c.is_required ? (
          <Badge variant="default">Si</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (c) =>
        c.is_active ? (
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
          onChange={handleSearchChange}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar configuraciones..."
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

      <CustomTable<SubjectAcademicConfigT>
        data={subjectAcademicConfigs}
        columns={columns}
        isLoading={isLoading && subjectAcademicConfigs.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron configuraciones con los filtros aplicados"
            : "No se encontraron configuraciones"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando configuraciones..."
        rowActions={(c) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(c)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(c)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Editar"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(c)}
              className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Desactivar"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={subjectAcademicConfigs.length}
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
