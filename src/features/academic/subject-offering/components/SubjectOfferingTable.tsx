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
  SubjectOfferingListParamsT,
  SubjectOfferingOrderingT,
  SubjectOfferingT,
} from "../subject-offering.types";

const ORDERING_OPTIONS: { label: string; value: SubjectOfferingOrderingT }[] = [
  { label: "Mas recientes", value: "-id" },
  { label: "Mas antiguos", value: "id" },
];

type SubjectOfferingTableProps = {
  subjectOfferings: SubjectOfferingT[];
  isLoading: boolean;
  loadSubjectOfferings: (params?: SubjectOfferingListParamsT) => void;
  onEdit: (offering: SubjectOfferingT) => void;
  onView: (offering: SubjectOfferingT) => void;
  onDelete: (offering: SubjectOfferingT) => void;
};

export const SubjectOfferingTable = ({
  subjectOfferings,
  isLoading,
  loadSubjectOfferings,
  onEdit,
  onView,
  onDelete,
}: SubjectOfferingTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<SubjectOfferingOrderingT>("-id");
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: SubjectOfferingOrderingT;
    }) => {
      loadSubjectOfferings({
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search:
          overrides?.search !== undefined
            ? overrides.search
            : search || undefined,
        ordering: overrides?.ordering ?? ordering,
      });
    },
    [loadSubjectOfferings, page, pageSize, search, ordering],
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
      const newOrdering = e.target.value as SubjectOfferingOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const hasNextPage = subjectOfferings.length >= pageSize;

  const columns: TableColumnProps<SubjectOfferingT>[] = [
    {
      key: "school_year_name",
      label: "Ano Escolar",
      className: tableFirstColumnClassname,
    },
    {
      key: "section_name",
      label: "Seccion",
      className: tableColumnsClassname,
    },
    {
      key: "subject_academic_config_name",
      label: "Configuracion",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (o) =>
        o.is_active ? (
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
          placeholder="Filtrar ofertas..."
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

      <CustomTable<SubjectOfferingT>
        data={subjectOfferings}
        columns={columns}
        isLoading={isLoading && subjectOfferings.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron ofertas con los filtros aplicados"
            : "No se encontraron ofertas de materia"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando ofertas..."
        rowActions={(o) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(o)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(o)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Editar"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(o)}
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
        totalItems={subjectOfferings.length}
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
