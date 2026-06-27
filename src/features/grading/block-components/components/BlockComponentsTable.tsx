import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomSelect, SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import { useBlockComponentFilterCatalogs } from "../hooks/useBlockComponentOptions";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  BlockComponentListParamsT,
  BlockComponentOrderingT,
  BlockComponentT,
} from "../block-components.types";

const OrderingOptions: { label: string; value: BlockComponentOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Ponderación (asc)", value: "internal_weight" },
  { label: "Ponderación (desc)", value: "-internal_weight" },
];

interface BlockComponentsTableProps {
  blockComponents: BlockComponentT[];
  totalCount: number;
  isLoading: boolean;
  loadBlockComponents: (params?: BlockComponentListParamsT) => void;
  onEdit: (s: BlockComponentT) => void;
  onView: (s: BlockComponentT) => void;
  onDelete: (s: BlockComponentT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const BlockComponentsTable: React.FC<BlockComponentsTableProps> = ({
  blockComponents,
  totalCount,
  isLoading,
  loadBlockComponents,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<BlockComponentOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);
  const [evalBlockFilter, setEvalBlockFilter] = useState<number | 0>(0);
  const [periodFilter, setPeriodFilter] = useState<number | 0>(0);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { evaluationBlockOptions, academicPeriodOptions, statusOptions } = useBlockComponentFilterCatalogs();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const f: { evaluation_block?: number; academic_period?: number; is_active?: boolean } = {};
    if (evalBlockFilter) f.evaluation_block = evalBlockFilter;
    if (periodFilter) f.academic_period = periodFilter;
    if (statusFilter === "active") f.is_active = true;
    else if (statusFilter === "inactive") f.is_active = false;
    return f;
  }, [evalBlockFilter, periodFilter, statusFilter]);

  const fetchData = useCallback(
    (params?: BlockComponentListParamsT) => {
      loadBlockComponents(params);
    },
    [loadBlockComponents],
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
    (value: BlockComponentOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, ordering: value, search: search || undefined, filters: buildFilters() });
    },
    [fetchData, search, buildFilters],
  );

  const handleEvalBlockFilterChange = useCallback(
    (value: number) => {
      setEvalBlockFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { evaluation_block: value || undefined, academic_period: periodFilter || undefined, is_active: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined } });
    },
    [fetchData, ordering, search, periodFilter, statusFilter],
  );

  const handlePeriodFilterChange = useCallback(
    (value: number) => {
      setPeriodFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { evaluation_block: evalBlockFilter || undefined, academic_period: value || undefined, is_active: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined } });
    },
    [fetchData, ordering, search, evalBlockFilter, statusFilter],
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { evaluation_block: evalBlockFilter || undefined, academic_period: periodFilter || undefined, is_active: value === "active" ? true : value === "inactive" ? false : undefined } });
    },
    [fetchData, ordering, search, evalBlockFilter, periodFilter],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<BlockComponentT>[] = [
    { key: "name", label: "Nombre", className: tableFirstColumnClassname, render: (s) => <span>{s.name}</span> },
    { key: "evaluation_block_name", label: "Bloque", className: tableColumnsClassname, render: (s) => <span>{s.evaluation_block_name}</span> },
    { key: "internal_weight", label: "Ponderación", className: tableColumnsClassname, render: (s) => <span>{s.internal_weight}%</span> },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput name="search" type="text" onChange={handleSearch} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar componentes..." />
        <CustomSelect name="filter-eval-block" label="" placeholder="Todos los bloques" value={evalBlockFilter} options={evaluationBlockOptions} onChange={(option) => handleEvalBlockFilterChange(option.value ? Number(option.value) : 0)} className={filterSelectClassname} />
        <CustomSelect name="filter-period" label="" placeholder="Todos los períodos" value={periodFilter} options={academicPeriodOptions} onChange={(option) => handlePeriodFilterChange(option.value ? Number(option.value) : 0)} className={filterSelectClassname} />
        <CustomSelect name="filter-status" label="" placeholder="Todos" value={statusFilter} options={statusOptions} onChange={(option) => handleStatusFilterChange(option.value as string)} className={filterSelectClassname} />
        <CustomSelect name="ordering" label="" placeholder="Ordenar" value={ordering} options={OrderingOptions} onChange={(option) => handleOrdering(option.value as BlockComponentOrderingT)} className={filterSelectClassname} />
      </div>
      <CustomTable<BlockComponentT> data={blockComponents} columns={columns} isLoading={isLoading && blockComponents.length === 0}
        emptyMessage={hasSearched ? "No se encontraron componentes con los filtros" : "No se encontraron componentes de bloque"}
        actionsTitle="Acciones" className={tableClassname} loadingMessage="Cargando..."
        rowActions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => onView(s)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Ver"><Eye className="size-4" /></button>
            {canEdit && <button type="button" onClick={() => onEdit(s)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Editar"><Pencil className="size-4" /></button>}
            {canDelete && <button type="button" onClick={() => onDelete(s)} className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Desactivar"><Trash2 className="size-4" /></button>}
          </div>
        )}
      />
      <Pagination page={page} pageSize={pageSize} totalItems={totalCount} isLoading={isLoading} hasNextPage={hasNextPage}
        onPageChange={(np) => { setPage(np); fetchData({ page: np, ordering, search: search || undefined, filters: buildFilters() }); }}
        onPageSizeChange={(ns) => { setPageSize(ns); setPage(1); fetchData({ page: 1, pageSize: ns, ordering, search: search || undefined, filters: buildFilters() }); }} />
    </div>
  );
};
