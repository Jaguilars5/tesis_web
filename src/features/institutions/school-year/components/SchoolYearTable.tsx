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
  SchoolYearListParamsT,
  SchoolYearOrderingT,
  SchoolYearT,
} from "../school-year.types";

const OrderingOptions: { label: string; value: SchoolYearOrderingT }[] = [
  { label: "Inicio (A-Z)", value: "start_date" },
  { label: "Inicio (Z-A)", value: "-start_date" },
  { label: "Fin (A-Z)", value: "end_date" },
  { label: "Fin (Z-A)", value: "-end_date" },
];

interface SchoolYearTableProps {
  schoolYears: SchoolYearT[];
  isLoading: boolean;
  loadSchoolYears: (p?: SchoolYearListParamsT) => void;
  onEdit: (s: SchoolYearT) => void;
  onView: (s: SchoolYearT) => void;
  onDelete: (s: SchoolYearT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const SchoolYearTable = ({
  schoolYears,
  isLoading,
  loadSchoolYears,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}: SchoolYearTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<SchoolYearOrderingT>("start_date");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [hasSearched, setHasSearched] = useState(false);
  const dr = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildParams = useCallback(
    (overrides?: Partial<SchoolYearListParamsT>): SchoolYearListParamsT => {
      const filters: SchoolYearListParamsT["filters"] = {};
      const active = overrides?.filters?.is_active ?? isActiveFilter;
      if (active !== undefined) filters.is_active = active;

      return {
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search: (overrides?.search ?? search) || undefined,
        ordering: overrides?.ordering ?? ordering,
        ...(Object.keys(filters).length > 0 ? { filters } : {}),
      };
    },
    [search, page, pageSize, ordering, isActiveFilter],
  );

  const fetchData = useCallback(
    (overrides?: Partial<SchoolYearListParamsT>) => {
      loadSchoolYears(buildParams(overrides));
    },
    [loadSchoolYears, buildParams],
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearch(v);
      setPage(1);
      setHasSearched(true);
      if (dr.current) clearTimeout(dr.current);
      dr.current = setTimeout(() => {
        fetchData({ page: 1, search: v || undefined });
      }, 400);
    },
    [fetchData],
  );

  const handleOrdering = useCallback(
    (value: SchoolYearOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ ordering: value });
    },
    [fetchData],
  );

  const handleIsActiveChange = useCallback(
    (value: string) => {
      const parsed = value === "" ? undefined : value === "true";
      setIsActiveFilter(parsed);
      setPage(1);
      fetchData({ filters: { is_active: parsed } });
    },
    [fetchData],
  );

  const hasNextPage = schoolYears.length >= pageSize;

  const columns: TableColumnProps<SchoolYearT>[] = [
    { key: "name", label: "Año Escolar", className: tableFirstColumnClassname },
    { key: "start_date", label: "Inicio", className: tableColumnsClassname },
    { key: "end_date", label: "Fin", className: tableColumnsClassname },
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
          placeholder="Filtrar años..."
        />
        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as SchoolYearOrderingT)
          }
          className={filterSelectClassname}
        />
        <CustomSelect
          name="is_active"
          label=""
          placeholder="Estado"
          value={isActiveFilter === undefined ? "" : String(isActiveFilter)}
          options={[
            { label: "Activos", value: "true" },
            { label: "Inactivos", value: "false" },
          ]}
          onChange={(option) => handleIsActiveChange(option.value as string)}
          className={filterSelectClassname}
        />
      </div>
      <CustomTable<SchoolYearT>
        data={schoolYears}
        columns={columns}
        isLoading={isLoading && schoolYears.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron años con los filtros"
            : "No se encontraron años escolares"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando..."
        rowActions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(s)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
              title="Ver"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(s)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(s)}
                className="inline-flex items-center justify-center rounded-md p-2 text-red-400 hover:bg-red-50"
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
        totalItems={schoolYears.length}
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
