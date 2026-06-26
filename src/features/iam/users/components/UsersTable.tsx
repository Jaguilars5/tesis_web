import { Eye, KeyRound, Pencil, Trash2 } from "lucide-react";
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
import { useRoleOptions } from "@shared/hooks/useRoleOptions";
import { STATUS_OPTIONS } from "@shared/hooks/useStatusOptions";
import { Badge } from "@shared/components/Badge";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type { UserListParamsT, UserOrderingT, UserT } from "../users.types";

const OrderingOptions: { label: string; value: UserOrderingT }[] = [
  { label: "Usuario (A-Z)", value: "username" },
  { label: "Usuario (Z-A)", value: "-username" },
  { label: "Creado (asc)", value: "created_at" },
  { label: "Creado (desc)", value: "-created_at" },
];

interface Props {
  data: UserT[];
  isLoading: boolean;
  loadData: (params?: UserListParamsT) => void;
  onEdit: (entity: UserT) => void;
  onView: (entity: UserT) => void;
  onDelete: (entity: UserT) => void;
  onChangePassword: (entity: UserT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const UsersTable: React.FC<Props> = ({
  data,
  isLoading,
  loadData,
  onEdit,
  onView,
  onDelete,
  onChangePassword,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<UserOrderingT>("username");
  const [hasSearched, setHasSearched] = useState(false);
  const [roleFilter, setRoleFilter] = useState<number | 0>(0);
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");
  const { roleOptions } = useRoleOptions();

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const filters: Record<string, string | number | boolean> = {};
    if (roleFilter) filters.role_id = roleFilter;
    if (isActiveFilter) filters.is_active = isActiveFilter === "active";
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [roleFilter, isActiveFilter]);

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: UserOrderingT;
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
      const newOrdering = option.value as UserOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const handleRoleChange = useCallback(
    (option: SelectOptionT) => {
      setRoleFilter(Number(option.value) || 0);
      setPage(1);
    },
    [],
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
  }, [roleFilter, isActiveFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasNextPage = data.length >= pageSize;

  const columns: TableColumnProps<UserT>[] = [
    { key: "username", label: "Usuario", className: tableFirstColumnClassname },
    {
      key: "names",
      label: "Nombres",
      className: tableColumnsClassname,
      render: (entity) => <span>{entity.names} {entity.last_names}</span>,
    },
    { key: "email", label: "Email", className: tableColumnsClassname },
    { key: "role_name", label: "Rol", className: tableColumnsClassname },
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
          placeholder="Filtrar usuarios..."
        />

        <CustomSelect
          name="filter-role"
          label=""
          placeholder="Todos los roles"
          value={roleFilter}
          options={roleOptions}
          onChange={handleRoleChange}
          className={filterSelectClassname}
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

      <CustomTable<UserT>
        data={data}
        columns={columns}
        isLoading={isLoading && data.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron usuarios con los filtros aplicados"
            : "No se encontraron usuarios"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando usuarios..."
        rowActions={(entity) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => onView(entity)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Ver detalle">
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button type="button" onClick={() => onEdit(entity)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Editar">
                <Pencil className="size-4" />
              </button>
            )}
            <button type="button" onClick={() => onChangePassword(entity)} className="inline-flex items-center justify-center rounded-md p-2 text-amber-400 transition-colors hover:bg-amber-50 hover:text-amber-600" title="Cambiar contraseña">
              <KeyRound className="size-4" />
            </button>
            {canDelete && (
              <button type="button" onClick={() => onDelete(entity)} className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Eliminar">
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
        onPageChange={(newPage) => { setPage(newPage); fetchData({ page: newPage }); }}
        onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); fetchData({ page: 1, pageSize: newSize }); }}
      />
    </div>
  );
};
