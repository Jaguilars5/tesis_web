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
import { useAcademicPeriodOptions } from "@shared/hooks/useAcademicPeriodOptions";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type {
  PeriodGradeSummaryListParamsT,
  PeriodGradeSummaryOrderingT,
  PeriodGradeSummaryT,
} from "../period-grade-summaries.types";

const OrderingOptions: { label: string; value: PeriodGradeSummaryOrderingT }[] = [
  { label: "Estudiante (A-Z)", value: "enrollment_name" },
  { label: "Estudiante (Z-A)", value: "-enrollment_name" },
  { label: "Oferta (A-Z)", value: "subject_offering_name" },
  { label: "Oferta (Z-A)", value: "-subject_offering_name" },
  { label: "Período (A-Z)", value: "academic_period_name" },
  { label: "Período (Z-A)", value: "-academic_period_name" },
  { label: "Promedio (asc)", value: "final_avg_truncated" },
  { label: "Promedio (desc)", value: "-final_avg_truncated" },
];

interface Props {
  periodGradeSummaries: PeriodGradeSummaryT[];
  isLoading: boolean;
  loadPeriodGradeSummaries: (params?: PeriodGradeSummaryListParamsT) => void;
  onEdit: (entity: PeriodGradeSummaryT) => void;
  onView: (entity: PeriodGradeSummaryT) => void;
  onDelete: (entity: PeriodGradeSummaryT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const PeriodGradeSummariesTable: React.FC<Props> = ({
  periodGradeSummaries,
  isLoading,
  loadPeriodGradeSummaries,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<PeriodGradeSummaryOrderingT>("-final_avg_truncated");
  const [hasSearched, setHasSearched] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<number | 0>(0);

  const { academicPeriodOptions } = useAcademicPeriodOptions();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const filters: Record<string, string | number | boolean> = {};
    if (periodFilter) filters.academic_period = periodFilter;
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [periodFilter]);

  const fetchData = useCallback(
    (options?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: PeriodGradeSummaryOrderingT;
      filters?: Record<string, string | number | boolean>;
    }) => {
      loadPeriodGradeSummaries({
        page: options?.page ?? page,
        pageSize: options?.pageSize ?? pageSize,
        search: options?.search !== undefined ? options.search : search || undefined,
        ordering: options?.ordering ?? ordering,
        filters: options?.filters ?? buildFilters(),
      });
    },
    [loadPeriodGradeSummaries, page, pageSize, search, ordering, buildFilters],
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
      const newOrdering = option.value as PeriodGradeSummaryOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const handlePeriodChange = useCallback(
    (option: SelectOptionT) => {
      setPeriodFilter(Number(option.value) || 0);
      setPage(1);
    },
    [],
  );

  useEffect(() => {
    fetchData({ page: 1 });
  }, [periodFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasNextPage = periodGradeSummaries.length >= pageSize;

  const columns: TableColumnProps<PeriodGradeSummaryT>[] = [
    { key: "enrollment_name", label: "Estudiante", className: tableFirstColumnClassname },
    { key: "subject_offering_name", label: "Oferta", className: tableColumnsClassname },
    { key: "academic_period_name", label: "Período", className: tableColumnsClassname },
    {
      key: "final_avg_truncated",
      label: "Promedio",
      className: tableColumnsClassname,
      render: (entity) => (
        <Badge
          variant={
            entity.final_avg_truncated >= 7
              ? "default"
              : entity.final_avg_truncated >= 5
                ? "secondary"
                : "destructive"
          }
        >
          {entity.final_avg_truncated}
        </Badge>
      ),
    },
    {
      key: "requires_recovery",
      label: "Recupera",
      className: tableColumnsClassname,
      render: (entity) =>
        entity.requires_recovery ? (
          <Badge variant="destructive">Sí</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
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
          name="filter-period"
          label=""
          placeholder="Todos los períodos"
          value={periodFilter}
          options={academicPeriodOptions}
          onChange={handlePeriodChange}
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

      <CustomTable<PeriodGradeSummaryT>
        data={periodGradeSummaries}
        columns={columns}
        isLoading={isLoading && periodGradeSummaries.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron resúmenes con los filtros"
            : "No se encontraron resúmenes de calificaciones"
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
        totalItems={periodGradeSummaries.length}
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
