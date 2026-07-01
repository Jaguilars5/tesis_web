import { Eye, Pencil } from "lucide-react";
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
import { Badge } from "@shared/components/Badge";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type { RoleListParamsT, RoleOrderingT, RoleT } from "../roles.types";

const OrderingOptions: { label: string; value: RoleOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Creado (asc)", value: "created_at" },
  { label: "Creado (desc)", value: "-created_at" },
];

interface Props {
  data: RoleT[];
  isLoading: boolean;
  loadData: (params?: RoleListParamsT) => void;
  onEdit: (entity: RoleT) => void;
  onView: (entity: RoleT) => void;
  canEdit?: boolean;
}

export const RolesTable: React.FC<Props> = ({
  data,
  isLoading,
  loadData,
  onEdit,
  onView,
  canEdit = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<RoleOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const filters: Record<string, string | number | boolean> = {};
    if (isActiveFilter) filters.is_active = isActiveFilter === "active";
    return Object.keys(filters).length > 0 ? filters : undefined;
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
        search: overrides?.search !== undefined ? overrides.search : search || undefined,
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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
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
    (option: SelectOptionT) => {
      const newOrdering = option.value as RoleOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const handleIsActiveChange = useCallback(
    (option: SelectOptionT) => {
      setIsActiveFilter(option.value as string);
      setPage(1);
    },
    [],
  );

  useEffect(() => {
    fetchData({ page: 1 });
  }, [isActiveFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasNextPage = data.length >= pageSize;

  const columns: TableColumnProps<RoleT>[] = [
    { key: "name", label: "Nombre", className: tableFirstColumnClassname },
    { key: "description", label: "Descripción", className: tableColumnsClassname },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (entity) =>
        entity.is_active ? (
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
          onChange={handleIsActiveChange}
          className={filterSelectClassname}
        />

        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por..."
          value={ordering}
          options={OrderingOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChange={handleOrderingChange}
          className={filterSelectClassname}
        />
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
        rowActions={(entity) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(entity)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(entity)}
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
