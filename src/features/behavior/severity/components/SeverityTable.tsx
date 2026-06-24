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
  SeverityListParamsT,
  SeverityOrderingT,
  SeverityT,
} from "../severity.types";
const ORDERING_OPTIONS: { label: string; value: SeverityOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Código (A-Z)", value: "code" },
  { label: "Código (Z-A)", value: "-code" },
];
type Props = {
  severities: SeverityT[];
  isLoading: boolean;
  loadSeverities: (p?: SeverityListParamsT) => void;
  onEdit: (s: SeverityT) => void;
  onView: (s: SeverityT) => void;
  onDelete: (s: SeverityT) => void;
};
export const SeverityTable = ({
  severities,
  isLoading,
  loadSeverities,
  onEdit,
  onView,
  onDelete,
}: Props) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<SeverityOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: SeverityOrderingT;
    }) => {
      loadSeverities({
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search:
          overrides?.search !== undefined
            ? overrides.search
            : search || undefined,
        ordering: overrides?.ordering ?? ordering,
      });
    },
    [loadSeverities, page, pageSize, search, ordering],
  );
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearch(v);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({ page: 1, search: v || undefined });
      }, 400);
    },
    [fetchData],
  );
  const handleOrderingChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newOrdering = e.target.value as SeverityOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );
  const hasNextPage = severities.length >= pageSize;
  const columns: TableColumnProps<SeverityT>[] = [
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
          onChange={handleSearchChange}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar severidades..."
        />
        <select
          value={ordering}
          onChange={handleOrderingChange}
          className="block w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Ordenar por"
        >
          {ORDERING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <CustomTable<SeverityT>
        data={severities}
        columns={columns}
        isLoading={isLoading && severities.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron severidades con los filtros aplicados"
            : "No se encontraron severidades"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando severidades..."
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
            <button
              type="button"
              onClick={() => onEdit(s)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Editar"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(s)}
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
        totalItems={severities.length}
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
