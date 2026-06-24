import { CheckCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { SearchInput } from "@shared/components/Form";
import { CustomSelect } from "@shared/components/Form/CustomSelect/CustomSelect";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import {
  attendedOptions,
  urgencyOptions,
  alertTypeOptions,
  useEarlyAlertFilterCatalogs,
} from "../early-alerts.options";

import type { TableColumnProps } from "@shared/components/Table";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type {
  AlertTypeT,
  EarlyAlertFiltersT,
  EarlyAlertListParamsT,
  EarlyAlertOrderingT,
  EarlyAlertT,
  UrgencyLevelT,
} from "../early-alerts.types";

const ORDERING_OPTIONS: { label: string; value: EarlyAlertOrderingT }[] = [
  { label: "Detectado (reciente)", value: "-detected_at" },
  { label: "Detectado (antiguo)", value: "detected_at" },
  { label: "Urgencia (asc)", value: "urgency_level" },
  { label: "Urgencia (desc)", value: "-urgency_level" },
];

const selectClassNames = {
  container: "min-w-40",
  label: "mb-1 block text-xs font-medium text-slate-600",
  select:
    "block w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary",
};

type EarlyAlertTableProps = {
  data: EarlyAlertT[];
  isLoading: boolean;
  loadData: (params?: EarlyAlertListParamsT) => void;
  onEdit: (entity: EarlyAlertT) => void;
  onView: (entity: EarlyAlertT) => void;
  onDelete: (entity: EarlyAlertT) => void;
  onMarkAttended: (entity: EarlyAlertT) => void;
};

const urgencyColor = (level: string | null): string => {
  const colors: Record<string, string> = {
    low: "bg-blue-50 text-blue-700",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-orange-50 text-orange-700",
    critical: "bg-red-50 text-red-700",
  };
  return colors[level ?? ""] || "bg-slate-100 text-slate-600";
};

export const EarlyAlertTable = ({
  data,
  isLoading,
  loadData,
  onEdit,
  onView,
  onDelete,
  onMarkAttended,
}: EarlyAlertTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<EarlyAlertOrderingT>("-detected_at");
  const [hasSearched, setHasSearched] = useState(false);
  const [attendedFilter, setAttendedFilter] = useState<string>("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("");
  const [alertTypeFilter, setAlertTypeFilter] = useState<string>("");
  const [periodFilter, setPeriodFilter] = useState<number | "">("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { academicPeriodOptions } = useEarlyAlertFilterCatalogs();

  const buildFilters = useCallback((): EarlyAlertFiltersT | undefined => {
    const f: EarlyAlertFiltersT = {};
    if (attendedFilter !== "") f.attended = attendedFilter === "true";
    if (urgencyFilter !== "") f.urgency_level = urgencyFilter as UrgencyLevelT;
    if (alertTypeFilter !== "") f.alert_type = alertTypeFilter as AlertTypeT;
    if (periodFilter !== "") f.academic_period = Number(periodFilter);
    return Object.keys(f).length > 0 ? f : undefined;
  }, [attendedFilter, urgencyFilter, alertTypeFilter, periodFilter]);

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: EarlyAlertOrderingT;
      filters?: EarlyAlertFiltersT;
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
      const newOrdering = e.target.value as EarlyAlertOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const makeSelectHandler =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (opt: SelectOptionT) => {
      setter(opt.value as string);
      setPage(1);
      fetchData({ page: 1 });
    };
  const makeNumberHandler =
    (setter: React.Dispatch<React.SetStateAction<number | "">>) =>
    (opt: SelectOptionT) => {
      setter(opt.value ? (Number(opt.value) as typeof periodFilter) : "");
      setPage(1);
      fetchData({ page: 1 });
    };

  const hasNextPage = data.length >= pageSize;

  const columns: TableColumnProps<EarlyAlertT>[] = [
    {
      key: "enrollment_name",
      label: "Estudiante",
      className: tableFirstColumnClassname,
      render: (p) => <span className="font-medium">{p.enrollment_name}</span>,
    },
    {
      key: "alert_type",
      label: "Tipo",
      className: tableColumnsClassname,
      render: (p) => <span>{p.alert_type ?? "—"}</span>,
    },
    {
      key: "urgency_level",
      label: "Urgencia",
      className: tableColumnsClassname,
      render: (p) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${urgencyColor(p.urgency_level)}`}
        >
          {p.urgency_level ?? "—"}
        </span>
      ),
    },
    {
      key: "academic_period_name",
      label: "Período",
      className: tableColumnsClassname,
    },
    {
      key: "attended",
      label: "Estado",
      className: tableColumnsClassname,
      render: (p) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${p.attended ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
        >
          <span
            className={`size-1.5 rounded-full ${p.attended ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          {p.attended ? "Atendida" : "Pendiente"}
        </span>
      ),
    },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput
          name="search"
          type="text"
          onChange={handleSearchChange}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar alertas..."
        />
        <CustomSelect
          name="filter-attended"
          label="Estado"
          placeholder="Todos"
          value={attendedFilter}
          options={attendedOptions}
          onChange={makeSelectHandler(setAttendedFilter)}
          className={selectClassNames}
        />
        <CustomSelect
          name="filter-urgency"
          label="Urgencia"
          placeholder="Todas"
          value={urgencyFilter}
          options={urgencyOptions}
          onChange={makeSelectHandler(setUrgencyFilter)}
          className={selectClassNames}
        />
        <CustomSelect
          name="filter-type"
          label="Tipo"
          placeholder="Todos"
          value={alertTypeFilter}
          options={alertTypeOptions}
          onChange={makeSelectHandler(setAlertTypeFilter)}
          className={selectClassNames}
        />
        <CustomSelect
          name="filter-period"
          label="Período"
          placeholder="Todos"
          value={periodFilter}
          options={academicPeriodOptions}
          onChange={makeNumberHandler(setPeriodFilter)}
          className={selectClassNames}
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

      <CustomTable<EarlyAlertT>
        data={data}
        columns={columns}
        isLoading={isLoading && data.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron alertas con los filtros aplicados"
            : "No se encontraron alertas tempranas"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando alertas..."
        // rowActions={(p) => (
        //   <div className="flex items-center justify-end gap-1">
        //     <button type="button" onClick={() => onView(p)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Ver detalle"><Eye className="size-4" /></button>
        //     {!p.attended && (
        //       <button type="button" onClick={() => onMarkAttended(p)} className="inline-flex items-center justify-center rounded-md p-2 text-emerald-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600" title="Marcar como atendida"><CheckCircle className="size-4" /></button>
        //     )}
        //     <button type="button" onClick={() => onEdit(p)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Editar"><Pencil className="size-4" /></button>
        //     <button type="button" onClick={() => onDelete(p)} className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Desactivar"><Trash2 className="size-4" /></button>
        //   </div>
        // )}
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
