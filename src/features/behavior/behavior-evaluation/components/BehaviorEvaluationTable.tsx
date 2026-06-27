import { Eye, Pencil } from "lucide-react";
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

import {
  useEnrollmentOptions,
  useAcademicPeriodOptions,
} from "../../conduct-incident/hooks/useConductIncidentOptions";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  BehaviorEvaluationListParamsT,
  BehaviorEvaluationOrderingT,
  BehaviorEvaluationT,
} from "../behavior-evaluation.types";

const OrderingOptions: { label: string; value: BehaviorEvaluationOrderingT }[] =
  [
    { label: "Más reciente", value: "-id" },
    { label: "Más antiguo", value: "id" },
    { label: "Evaluación (reciente)", value: "-evaluation_date" },
    { label: "Evaluación (antiguo)", value: "evaluation_date" },
    { label: "Creado (reciente)", value: "-created_at" },
    { label: "Creado (antiguo)", value: "created_at" },
  ];

interface BehaviorEvaluationTableProps {
  behaviorEvaluations: BehaviorEvaluationT[];
  totalCount: number;
  isLoading: boolean;
  loadBehaviorEvaluations: (params?: BehaviorEvaluationListParamsT) => void;
  onEdit: (e: BehaviorEvaluationT) => void;
  onView: (e: BehaviorEvaluationT) => void;
  canEdit?: boolean;
}

export const BehaviorEvaluationTable: React.FC<BehaviorEvaluationTableProps> = ({
  behaviorEvaluations,
  totalCount,
  isLoading,
  loadBehaviorEvaluations,
  onEdit,
  onView,
  canEdit = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<BehaviorEvaluationOrderingT>("-id");
  const [hasSearched, setHasSearched] = useState(false);
  const [enrollmentFilter, setEnrollmentFilter] = useState<number | 0>(0);
  const [periodFilter, setPeriodFilter] = useState<number | 0>(0);
  const { enrollmentOptions } = useEnrollmentOptions();
  const { academicPeriodOptions } = useAcademicPeriodOptions();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const filters: { enrollment?: number; academic_period?: number } = {};
    if (enrollmentFilter) filters.enrollment = enrollmentFilter;
    if (periodFilter) filters.academic_period = periodFilter;
    return filters;
  }, [enrollmentFilter, periodFilter]);

  const fetchData = useCallback(
    (params?: BehaviorEvaluationListParamsT) => {
      loadBehaviorEvaluations(params);
    },
    [loadBehaviorEvaluations],
  );

  useEffect(() => {
    fetchData({ page: 1, pageSize, ordering, search: search || undefined, filters: buildFilters() });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearch(v);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({ page: 1, pageSize, search: v || undefined, ordering, filters: buildFilters() });
      }, 400);
    },
    [fetchData, pageSize, ordering, buildFilters],
  );

  const handleOrdering = useCallback(
    (value: BehaviorEvaluationOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, pageSize, ordering: value, search: search || undefined, filters: buildFilters() });
    },
    [fetchData, pageSize, search, buildFilters],
  );

  const handleEnrollmentFilterChange = useCallback(
    (value: number) => {
      setEnrollmentFilter(value);
      setPage(1);
      fetchData({ page: 1, pageSize, ordering, search: search || undefined, filters: { enrollment: value || undefined, academic_period: periodFilter || undefined } });
    },
    [fetchData, pageSize, ordering, search, periodFilter],
  );

  const handlePeriodFilterChange = useCallback(
    (value: number) => {
      setPeriodFilter(value);
      setPage(1);
      fetchData({ page: 1, pageSize, ordering, search: search || undefined, filters: { enrollment: enrollmentFilter || undefined, academic_period: value || undefined } });
    },
    [fetchData, pageSize, ordering, search, enrollmentFilter],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<BehaviorEvaluationT>[] = [
    {
      key: "enrollment_name",
      label: "Estudiante",
      className: tableFirstColumnClassname,
      render: (e) => <span>{e.enrollment_name}</span>,
    },
    {
      key: "academic_period_name",
      label: "Período",
      className: tableColumnsClassname,
      render: (e) => <span>{e.academic_period_name}</span>,
    },
    {
      key: "calculated_scale_name",
      label: "Escala Calc.",
      className: tableColumnsClassname,
      render: (e) => <Badge variant="default">{e.calculated_scale_name}</Badge>,
    },
    {
      key: "final_scale_name",
      label: "Escala Final",
      className: tableColumnsClassname,
      render: (e) =>
        e.final_scale_name ? (
          <Badge variant="default">{e.final_scale_name}</Badge>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: "evaluation_date",
      label: "Fecha",
      className: tableColumnsClassname,
      render: (e) => <span>{e.evaluation_date}</span>,
    },
    {
      key: "approval_date",
      label: "Aprobación",
      className: tableColumnsClassname,
      render: (e) =>
        e.approval_date ? (
          <Badge variant="secondary">Aprobado</Badge>
        ) : (
          <Badge variant="outline">Pendiente</Badge>
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
          placeholder="Filtrar evaluaciones..."
        />
        <CustomSelect
          name="filter-enrollment"
          label=""
          placeholder="Todos los estudiantes"
          value={enrollmentFilter}
          options={enrollmentOptions}
          onChange={(option) =>
            handleEnrollmentFilterChange(
              option.value ? Number(option.value) : 0,
            )
          }
          className={filterSelectClassname}
        />
        <CustomSelect
          name="filter-period"
          label=""
          placeholder="Todos los períodos"
          value={periodFilter}
          options={academicPeriodOptions}
          onChange={(option) =>
            handlePeriodFilterChange(option.value ? Number(option.value) : 0)
          }
          className={filterSelectClassname}
        />
        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as BehaviorEvaluationOrderingT)
          }
          className={filterSelectClassname}
        />
      </div>
      <CustomTable<BehaviorEvaluationT>
        data={behaviorEvaluations}
        columns={columns}
        isLoading={isLoading && behaviorEvaluations.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron evaluaciones con los filtros aplicados"
            : "No se encontraron evaluaciones de conducta"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando evaluaciones..."
        rowActions={(e) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(e)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(e)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Anular"
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
        totalItems={totalCount}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(np) => {
          setPage(np);
          fetchData({ page: np, pageSize, ordering, search: search || undefined, filters: buildFilters() });
        }}
        onPageSizeChange={(ns) => {
          setPageSize(ns);
          setPage(1);
          fetchData({ page: 1, pageSize: ns, ordering, search: search || undefined, filters: buildFilters() });
        }}
      />
    </div>
  );
};
