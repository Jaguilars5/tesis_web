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
import { STATUS_OPTIONS } from "@shared/hooks/useStatusOptions";
import { useBlockTypeOptions } from "../hooks/useBlockTypeOptions";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  EvaluationBlockListParamsT,
  EvaluationBlockOrderingT,
  EvaluationBlockT,
} from "../evaluation-blocks.types";

const OrderingOptions: { label: string; value: EvaluationBlockOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "% (asc)", value: "weight_percentage" },
  { label: "% (desc)", value: "-weight_percentage" },
  { label: "Tipo (A-Z)", value: "block_type" },
  { label: "Tipo (Z-A)", value: "-block_type" },
];

interface EvaluationBlockTableProps {
  evaluationBlocks: EvaluationBlockT[];
  totalCount: number;
  isLoading: boolean;
  loadEvaluationBlocks: (params?: EvaluationBlockListParamsT) => void;
  onEdit: (s: EvaluationBlockT) => void;
  onView: (s: EvaluationBlockT) => void;
  onDelete: (s: EvaluationBlockT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  academicPeriodOptions: { label: string; value: string }[];
  subjectOfferingOptions: { label: string; value: string }[];
}

export const EvaluationBlockTable: React.FC<EvaluationBlockTableProps> = ({
  evaluationBlocks,
  totalCount,
  isLoading,
  loadEvaluationBlocks,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
  academicPeriodOptions,
  subjectOfferingOptions,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<EvaluationBlockOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<number | 0>(0);
  const [offeringFilter, setOfferingFilter] = useState<number | 0>(0);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { blockTypeOptions } = useBlockTypeOptions();

  const blockTypeFilterOptions = [
    { label: "Todos", value: "" },
    ...blockTypeOptions,
  ];

  const buildFilters = useCallback(() => {
    const f: { academic_period?: number; subject_offering?: number; block_type?: string; is_active?: boolean } = {};
    if (periodFilter) f.academic_period = periodFilter;
    if (offeringFilter) f.subject_offering = offeringFilter;
    if (typeFilter) f.block_type = typeFilter;
    if (statusFilter === "active") f.is_active = true;
    else if (statusFilter === "inactive") f.is_active = false;
    return f;
  }, [periodFilter, offeringFilter, typeFilter, statusFilter]);

  const fetchData = useCallback(
    (params?: EvaluationBlockListParamsT) => {
      loadEvaluationBlocks(params);
    },
    [loadEvaluationBlocks],
  );

  useEffect(() => {
    fetchData({ ordering, search: search || undefined, filters: buildFilters() });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearch(v);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({ page: 1, search: v || undefined, ordering, filters: buildFilters() });
      }, 400);
    },
    [fetchData, ordering, buildFilters],
  );

  const handleOrdering = useCallback(
    (value: EvaluationBlockOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, ordering: value, search: search || undefined, filters: buildFilters() });
    },
    [fetchData, search, buildFilters],
  );

  const handlePeriodFilter = useCallback(
    (value: number) => {
      setPeriodFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { academic_period: value || undefined, subject_offering: offeringFilter || undefined, block_type: typeFilter || undefined, is_active: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined } });
    },
    [fetchData, ordering, search, offeringFilter, typeFilter, statusFilter],
  );

  const handleOfferingFilter = useCallback(
    (value: number) => {
      setOfferingFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { academic_period: periodFilter || undefined, subject_offering: value || undefined, block_type: typeFilter || undefined, is_active: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined } });
    },
    [fetchData, ordering, search, periodFilter, typeFilter, statusFilter],
  );

  const handleTypeFilter = useCallback(
    (value: string) => {
      setTypeFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { academic_period: periodFilter || undefined, subject_offering: offeringFilter || undefined, block_type: value || undefined, is_active: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined } });
    },
    [fetchData, ordering, search, periodFilter, offeringFilter, statusFilter],
  );

  const handleStatusFilter = useCallback(
    (value: string) => {
      setStatusFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { academic_period: periodFilter || undefined, subject_offering: offeringFilter || undefined, block_type: typeFilter || undefined, is_active: value === "active" ? true : value === "inactive" ? false : undefined } });
    },
    [fetchData, ordering, search, periodFilter, offeringFilter, typeFilter],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<EvaluationBlockT>[] = [
    { key: "name", label: "Nombre", className: tableFirstColumnClassname, render: (s) => <span>{s.name}</span> },
    { key: "academic_period_name", label: "Período", className: tableColumnsClassname },
    { key: "subject_offering_name", label: "Oferta", className: tableColumnsClassname },
    { key: "weight_percentage", label: "%", className: tableColumnsClassname, render: (s) => <span>{s.weight_percentage}%</span> },
    { key: "is_active", label: "Estado", className: tableColumnsClassname, render: (s) => s.is_active ? <Badge variant="default">Activo</Badge> : <Badge variant="outline">Inactivo</Badge> },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput name="search" type="text" onChange={handleSearch} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar bloques..." />
        <CustomSelect name="filter-period" label="" placeholder="Todos los períodos" value={periodFilter} options={academicPeriodOptions} onChange={(option) => handlePeriodFilter(option.value ? Number(option.value) : 0)} className={filterSelectClassname} />
        <CustomSelect name="filter-offering" label="" placeholder="Todas las ofertas" value={offeringFilter} options={subjectOfferingOptions} onChange={(option) => handleOfferingFilter(option.value ? Number(option.value) : 0)} className={filterSelectClassname} />
        <CustomSelect name="filter-type" label="" placeholder="Todos los tipos" value={typeFilter} options={blockTypeFilterOptions} onChange={(option) => handleTypeFilter(option.value as string)} className={filterSelectClassname} />
        <CustomSelect name="filter-status" label="" placeholder="Todos" value={statusFilter} options={STATUS_OPTIONS} onChange={(option) => handleStatusFilter(option.value as string)} className={filterSelectClassname} />
        <CustomSelect name="ordering" label="" placeholder="Ordenar" value={ordering} options={OrderingOptions} onChange={(option) => handleOrdering(option.value as EvaluationBlockOrderingT)} className={filterSelectClassname} />
      </div>
      <CustomTable<EvaluationBlockT> data={evaluationBlocks} columns={columns} isLoading={isLoading && evaluationBlocks.length === 0}
        emptyMessage={hasSearched ? "No se encontraron bloques con los filtros" : "No se encontraron bloques de evaluación"}
        actionsTitle="Acciones" className={tableClassname} loadingMessage="Cargando..."
        rowActions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => onView(s)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100" title="Ver"><Eye className="size-4" /></button>
            {canEdit && <button type="button" onClick={() => onEdit(s)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100" title="Editar"><Pencil className="size-4" /></button>}
            {canDelete && <button type="button" onClick={() => onDelete(s)} className="inline-flex items-center justify-center rounded-md p-2 text-red-400 hover:bg-red-50" title="Desactivar"><Trash2 className="size-4" /></button>}
          </div>
        )}
      />
      <Pagination page={page} pageSize={pageSize} totalItems={totalCount} isLoading={isLoading} hasNextPage={hasNextPage}
        onPageChange={(np) => { setPage(np); fetchData({ page: np, ordering, search: search || undefined, filters: buildFilters() }); }}
        onPageSizeChange={(ns) => { setPageSize(ns); setPage(1); fetchData({ page: 1, pageSize: ns, ordering, search: search || undefined, filters: buildFilters() }); }} />
    </div>
  );
};
