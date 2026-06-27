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

import { useEnrollmentOptions } from "../hooks/useConductIncidentOptions";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  ConductIncidentListParamsT,
  ConductIncidentOrderingT,
  ConductIncidentT,
} from "../conduct-incident.types";

const OrderingOptions: { label: string; value: ConductIncidentOrderingT }[] = [
  { label: "Más reciente", value: "-incident_date" },
  { label: "Más antiguo", value: "incident_date" },
];

interface ConductIncidentTableProps {
  conductIncidents: ConductIncidentT[];
  totalCount: number;
  isLoading: boolean;
  loadConductIncidents: (params?: ConductIncidentListParamsT) => void;
  onEdit: (e: ConductIncidentT) => void;
  onView: (e: ConductIncidentT) => void;
  canEdit?: boolean;
}

export const ConductIncidentTable: React.FC<ConductIncidentTableProps> = ({
  conductIncidents,
  totalCount,
  isLoading,
  loadConductIncidents,
  onEdit,
  onView,
  canEdit = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<ConductIncidentOrderingT>("-incident_date");
  const [hasSearched, setHasSearched] = useState(false);
  const [enrollmentFilter, setEnrollmentFilter] = useState<number | 0>(0);
  const { enrollmentOptions } = useEnrollmentOptions();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const filters: { enrollment?: number } = {};
    if (enrollmentFilter) filters.enrollment = enrollmentFilter;
    return filters;
  }, [enrollmentFilter]);

  const fetchData = useCallback(
    (params?: ConductIncidentListParamsT) => {
      loadConductIncidents(params);
    },
    [loadConductIncidents],
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
    (value: ConductIncidentOrderingT) => {
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
      fetchData({ page: 1, pageSize, ordering, search: search || undefined, filters: { enrollment: value || undefined } });
    },
    [fetchData, pageSize, ordering, search],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<ConductIncidentT>[] = [
    { key: "enrollment_name", label: "Estudiante", className: tableFirstColumnClassname, render: (e) => <span>{e.enrollment_name}</span> },
    { key: "incident_type_name", label: "Tipo", className: tableColumnsClassname },
    { key: "severity_name", label: "Severidad", className: tableColumnsClassname, render: (e) => <Badge variant={e.severity_name?.toLowerCase().includes("alto") ? "destructive" : "secondary"}>{e.severity_name}</Badge> },
    { key: "incident_date", label: "Fecha", className: tableColumnsClassname },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput name="search" type="text" onChange={handleSearch} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar incidentes..." />
        <CustomSelect name="filter-enrollment" label="" placeholder="Todos los estudiantes" value={enrollmentFilter} options={enrollmentOptions} onChange={(option) => handleEnrollmentFilterChange(option.value ? Number(option.value) : 0)} className={filterSelectClassname} />
        <CustomSelect name="ordering" label="" placeholder="Ordenar por" value={ordering} options={OrderingOptions} onChange={(option) => handleOrdering(option.value as ConductIncidentOrderingT)} className={filterSelectClassname} />
      </div>
      <CustomTable<ConductIncidentT> data={conductIncidents} columns={columns} isLoading={isLoading && conductIncidents.length === 0}
        emptyMessage={hasSearched ? "No se encontraron incidentes con los filtros aplicados" : "No se encontraron incidentes de conducta"}
        actionsTitle="Acciones" className={tableClassname} loadingMessage="Cargando incidentes..."
        rowActions={(e) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => onView(e)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Ver detalle"><Eye className="size-4" /></button>
            {canEdit && (
              <button type="button" onClick={() => onEdit(e)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Editar"><Pencil className="size-4" /></button>
            )}
          </div>
        )}
      />
      <Pagination page={page} pageSize={pageSize} totalItems={totalCount} isLoading={isLoading} hasNextPage={hasNextPage}
        onPageChange={(np) => { setPage(np); fetchData({ page: np, pageSize, ordering, search: search || undefined, filters: buildFilters() }); }}
        onPageSizeChange={(ns) => { setPageSize(ns); setPage(1); fetchData({ page: 1, pageSize: ns, ordering, search: search || undefined, filters: buildFilters() }); }} />
    </div>
  );
};
