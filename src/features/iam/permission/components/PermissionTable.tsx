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
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type {
  PermissionListParamsT,
  PermissionOrderingT,
  PermissionT,
} from "../permission.types";

const OrderingOptions: { label: string; value: PermissionOrderingT }[] = [
  { label: "Código (A-Z)", value: "code" },
  { label: "Código (Z-A)", value: "-code" },
  { label: "Módulo (A-Z)", value: "module" },
  { label: "Módulo (Z-A)", value: "-module" },
  { label: "Creado (asc)", value: "created_at" },
  { label: "Creado (desc)", value: "-created_at" },
];

const MODULE_OPTIONS: SelectOptionT[] = [
  { label: "Academic", value: "academic" },
  { label: "IAM", value: "iam" },
  { label: "Grading", value: "grading" },
  { label: "Behavior", value: "behavior" },
  { label: "Attendance", value: "attendance" },
  { label: "Analytics", value: "analytics" },
  { label: "Institutions", value: "institutions" },
  { label: "Students", value: "students" },
  { label: "Integration", value: "integration" },
];

interface Props {
  data: PermissionT[];
  isLoading: boolean;
  loadData: (params?: PermissionListParamsT) => void;
  onEdit: (entity: PermissionT) => void;
  onView: (entity: PermissionT) => void;
  onDelete: (entity: PermissionT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const PermissionTable: React.FC<Props> = ({
  data,
  isLoading,
  loadData,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<PermissionOrderingT>("code");
  const [hasSearched, setHasSearched] = useState(false);
  const [moduleFilter, setModuleFilter] = useState<string>("");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const filters: Record<string, string | number | boolean> = {};
    if (moduleFilter) filters.module = moduleFilter;
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [moduleFilter]);

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: PermissionOrderingT;
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
      const newOrdering = option.value as PermissionOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const handleModuleChange = useCallback(
    (option: SelectOptionT) => {
      setModuleFilter(option.value as string);
      setPage(1);
    },
    [],
  );

  useEffect(() => {
    fetchData({ page: 1 });
  }, [moduleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasNextPage = data.length >= pageSize;

  const columns: TableColumnProps<PermissionT>[] = [
    {
      key: "code",
      label: "Código",
      className: tableFirstColumnClassname,
    },
    {
      key: "description",
      label: "Descripción",
      className: tableColumnsClassname,
    },
    {
      key: "module",
      label: "Módulo",
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
          placeholder="Filtrar permisos..."
        />

        <CustomSelect
          name="filter-module"
          label=""
          placeholder="Todos los módulos"
          value={moduleFilter}
          options={MODULE_OPTIONS}
          onChange={handleModuleChange}
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

      <CustomTable<PermissionT>
        data={data}
        columns={columns}
        isLoading={isLoading && data.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron permisos con los filtros aplicados"
            : "No se encontraron permisos"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando permisos..."
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
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(entity)}
                className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Eliminar"
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
