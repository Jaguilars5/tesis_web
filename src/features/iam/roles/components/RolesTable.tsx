import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form/CustomSelect/CustomSelect";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";
import { STATUS_OPTIONS } from "@shared/hooks/useStatusOptions";

import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type { RoleListParamsT, RoleOrderingT, RoleT } from "../roles.types";
import { Badge } from "@shared/components/Badge";

const ORDERING_OPTIONS: { label: string; value: RoleOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Creado (asc)", value: "created_at" },
  { label: "Creado (desc)", value: "-created_at" },
];

type RolesTableProps = {
  data: RoleT[];
  isLoading: boolean;
  loadData: (params?: RoleListParamsT) => void;
  onEdit: (entity: RoleT) => void;
  onView: (entity: RoleT) => void;
  onDelete: (entity: RoleT) => void;
};

export const RolesTable = ({
  data,
  isLoading,
  loadData,
  onEdit,
  onView,
  onDelete,
}: RolesTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<RoleOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const f: Record<string, string | number | boolean> = {};
    if (isActiveFilter) f.is_active = isActiveFilter === "active";
    return Object.keys(f).length > 0 ? f : undefined;
  }, [isActiveFilter]);

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: RoleOrderingT;
      filters?: Record<string, string | number | boolean>;
    }) => {
      loadData({
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search:
          overrides?.search !== undefined
            ? overrides.search
            : search || undefined,
        ordering: overrides?.ordering ?? ordering,
        filters: overrides?.filters ?? buildFilters(),
      });
    },
    [loadData, page, pageSize, search, ordering, buildFilters],
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
      const newOrdering = e.target.value as RoleOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const hIsActive = useCallback((o: SelectOptionT) => {
    setIsActiveFilter(o.value as string);
    setPage(1);
  }, []);
  useEffect(() => {
    fetchData({ page: 1 });
  }, [isActiveFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasNextPage = data.length >= pageSize;

  const columns: TableColumnProps<RoleT>[] = [
    {
      key: "name",
      label: "Nombre",
      className: tableFirstColumnClassname,
    },
    {
      key: "description",
      label: "Descripción",
      className: tableColumnsClassname,
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
          onChange={handleSearchChange}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar roles..."
        />

        <CustomSelect
          name="filter-is_active"
          label=""
          placeholder="Todos"
          value={isActiveFilter}
          options={STATUS_OPTIONS}
          onChange={hIsActive}
          className={filterSelectClassname}
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

      <CustomTable<RoleT>
        data={data}
        columns={columns}
        isLoading={isLoading && data.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron roles con los filtros aplicados"
            : "No se encontraron roles"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando roles..."
        rowActions={(p) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(p)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(p)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Editar"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(p)}
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
        totalItems={data.length}
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
