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
  PeriodTypeListParamsT,
  PeriodTypeOrderingT,
  PeriodTypeT,
} from "../period-types.types";

const OrderingOptions: { label: string; value: PeriodTypeOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Código (A-Z)", value: "code" },
  { label: "Código (Z-A)", value: "-code" },
];

interface PeriodTypeTableProps {
  periodTypes: PeriodTypeT[];
  isLoading: boolean;
  loadPeriodTypes: (params?: PeriodTypeListParamsT) => void;
  onEdit: (periodType: PeriodTypeT) => void;
  onView: (periodType: PeriodTypeT) => void;
  onDelete: (periodType: PeriodTypeT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const PeriodTypeTable: React.FC<PeriodTypeTableProps> = ({
  periodTypes,
  isLoading,
  loadPeriodTypes,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<PeriodTypeOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (params?: PeriodTypeListParamsT) => {
      loadPeriodTypes(params);
    },
    [loadPeriodTypes],
  );

  useEffect(() => {
    fetchData({ page: 1, pageSize: 10, ordering: "name" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({
          page: 1,
          pageSize,
          search: value || undefined,
          ordering,
        });
      }, 400);
    },
    [fetchData, pageSize, ordering],
  );

  const handleOrdering = useCallback(
    (value: PeriodTypeOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering: value,
      });
    },
    [fetchData, pageSize, search],
  );

  const hasNextPage = periodTypes.length >= pageSize;

  const columns: TableColumnProps<PeriodTypeT>[] = [
    {
      key: "name",
      label: "Nombre",
      className: tableFirstColumnClassname,
    },
    {
      key: "divisions_per_year",
      label: "Divisiones/Año",
      className: tableColumnsClassname,
      render: (s) => <span>{s.divisions_per_year}</span>,
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
          placeholder="Filtrar tipos de periodo..."
        />

        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as PeriodTypeOrderingT)
          }
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<PeriodTypeT>
        data={periodTypes}
        columns={columns}
        isLoading={isLoading && periodTypes.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron tipos de periodo con los filtros aplicados"
            : "No se encontraron tipos de periodo"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando tipos de periodo..."
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
        totalItems={periodTypes.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchData({
            page: newPage,
            pageSize,
            search: search || undefined,
            ordering,
          });
        }}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
          fetchData({
            page: 1,
            pageSize: newSize,
            search: search || undefined,
            ordering,
          });
        }}
      />
    </div>
  );
};
