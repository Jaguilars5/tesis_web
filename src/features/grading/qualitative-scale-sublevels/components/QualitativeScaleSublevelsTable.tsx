import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomSelect } from "@shared/components/Form/CustomSelect/CustomSelect";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";
import { useQualitativeScaleSublevelOptions } from "../hooks/useQualitativeScaleSublevelOptions";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type {
  QualitativeScaleSublevelListParamsT,
  QualitativeScaleSublevelOrderingT,
  QualitativeScaleSublevelT,
} from "../qualitative-scale-sublevels.types";

const OrderingOptions: { label: string; value: QualitativeScaleSublevelOrderingT }[] = [
  { label: "Escala (A-Z)", value: "scale_name" },
  { label: "Escala (Z-A)", value: "-scale_name" },
  { label: "Subnivel (A-Z)", value: "sublevel_name" },
  { label: "Subnivel (Z-A)", value: "-sublevel_name" },
];

interface Props {
  qualitativeScaleSublevels: QualitativeScaleSublevelT[];
  isLoading: boolean;
  loadQualitativeScaleSublevels: (params?: QualitativeScaleSublevelListParamsT) => void;
  onEdit: (entity: QualitativeScaleSublevelT) => void;
  onView: (entity: QualitativeScaleSublevelT) => void;
  onDelete: (entity: QualitativeScaleSublevelT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const QualitativeScaleSublevelsTable: React.FC<Props> = ({
  qualitativeScaleSublevels,
  isLoading,
  loadQualitativeScaleSublevels,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<QualitativeScaleSublevelOrderingT>("scale_name");
  const [hasSearched, setHasSearched] = useState(false);
  const [scaleFilter, setScaleFilter] = useState<number | 0>(0);
  const [sublevelFilter, setSublevelFilter] = useState<number | 0>(0);

  const { scaleOptions, sublevelOptions } = useQualitativeScaleSublevelOptions();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const filters: Record<string, string | number | boolean> = {};
    if (scaleFilter) filters.scale = scaleFilter;
    if (sublevelFilter) filters.sublevel = sublevelFilter;
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [scaleFilter, sublevelFilter]);

  const fetchData = useCallback(
    (options?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: QualitativeScaleSublevelOrderingT;
      filters?: Record<string, string | number | boolean>;
    }) => {
      loadQualitativeScaleSublevels({
        page: options?.page ?? page,
        pageSize: options?.pageSize ?? pageSize,
        search: options?.search !== undefined ? options.search : search || undefined,
        ordering: options?.ordering ?? ordering,
        filters: options?.filters ?? buildFilters(),
      });
    },
    [loadQualitativeScaleSublevels, page, pageSize, search, ordering, buildFilters],
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
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

  const handleOrdering = useCallback(
    (option: SelectOptionT) => {
      const newOrdering = option.value as QualitativeScaleSublevelOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const handleScaleFilterChange = useCallback(
    (option: SelectOptionT) => {
      setScaleFilter(Number(option.value) || 0);
      setPage(1);
    },
    [],
  );

  const handleSublevelFilterChange = useCallback(
    (option: SelectOptionT) => {
      setSublevelFilter(Number(option.value) || 0);
      setPage(1);
    },
    [],
  );

  useEffect(() => {
    fetchData({ page: 1 });
  }, [scaleFilter, sublevelFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasNextPage = qualitativeScaleSublevels.length >= pageSize;

  const columns: TableColumnProps<QualitativeScaleSublevelT>[] = [
    { key: "scale_name", label: "Escala", className: tableFirstColumnClassname },
    { key: "sublevel_name", label: "Subnivel", className: tableColumnsClassname },
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
          onChange={handleSearch}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar..."
        />
        <CustomSelect
          name="filter-scale"
          label=""
          placeholder="Todas las escalas"
          value={scaleFilter}
          options={scaleOptions}
          onChange={handleScaleFilterChange}
          className={filterSelectClassname}
        />
        <CustomSelect
          name="filter-sublevel"
          label=""
          placeholder="Todos los subniveles"
          value={sublevelFilter}
          options={sublevelOptions}
          onChange={handleSublevelFilterChange}
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
          onChange={handleOrdering}
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<QualitativeScaleSublevelT>
        data={qualitativeScaleSublevels}
        columns={columns}
        isLoading={isLoading && qualitativeScaleSublevels.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron registros"
            : "No se encontraron escalas por subnivel"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando..."
        rowActions={(entity) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(entity)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
              title="Ver"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(entity)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(entity)}
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
        totalItems={qualitativeScaleSublevels.length}
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
        pageSizeOptions={[10, 25, 50]}
      />
    </div>
  );
};
