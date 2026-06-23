import { Eye, Pencil } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { tableClassname, tableColumnsClassname, tableFirstColumnClassname } from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";
import type { TableColumnProps } from "@shared/components/Table";
import type { BehaviorEvaluationListParamsT, BehaviorEvaluationOrderingT, BehaviorEvaluationT } from "../behavior-evaluation.types";

const ORDERING_OPTIONS: { label: string; value: BehaviorEvaluationOrderingT }[] = [{ label: "Más reciente", value: "-id" }, { label: "Más antiguo", value: "id" }];

type Props = { behaviorEvaluations: BehaviorEvaluationT[]; isLoading: boolean; loadBehaviorEvaluations: (params?: BehaviorEvaluationListParamsT) => void; onEdit: (e: BehaviorEvaluationT) => void; onView: (e: BehaviorEvaluationT) => void; };

export const BehaviorEvaluationTable = ({ behaviorEvaluations, isLoading, loadBehaviorEvaluations, onEdit, onView }: Props) => {
  const [search, setSearch] = useState(""); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<BehaviorEvaluationOrderingT>("-id"); const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fetchData = useCallback((overrides?: { page?: number; pageSize?: number; search?: string; ordering?: BehaviorEvaluationOrderingT }) => {
    loadBehaviorEvaluations({ page: overrides?.page ?? page, pageSize: overrides?.pageSize ?? pageSize, search: overrides?.search !== undefined ? overrides.search : search || undefined, ordering: overrides?.ordering ?? ordering });
  }, [loadBehaviorEvaluations, page, pageSize, search, ordering]);
  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setSearch(v); setPage(1); setHasSearched(true); if (debounceRef.current) clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => { fetchData({ page: 1, search: v || undefined }); }, 400); }, [fetchData]);
  const handleOrderingChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => { const newOrdering = e.target.value as BehaviorEvaluationOrderingT; setOrdering(newOrdering); setPage(1); fetchData({ page: 1, ordering: newOrdering }); }, [fetchData]);
  const hasNextPage = behaviorEvaluations.length >= pageSize;
  const columns: TableColumnProps<BehaviorEvaluationT>[] = [
    { key: "enrollment_name", label: "Estudiante", className: tableFirstColumnClassname, render: (e) => <span>{e.enrollment_name}</span> },
    { key: "academic_period_name", label: "Período", className: tableColumnsClassname, render: (e) => <span>{e.academic_period_name}</span> },
    { key: "calculated_scale_name", label: "Escala Calc.", className: tableColumnsClassname, render: (e) => <Badge variant="default">{e.calculated_scale_name}</Badge> },
    { key: "final_scale_name", label: "Escala Final", className: tableColumnsClassname, render: (e) => e.final_scale_name ? <Badge variant="default">{e.final_scale_name}</Badge> : <span className="text-slate-400">—</span> },
    { key: "evaluation_date", label: "Fecha", className: tableColumnsClassname, render: (e) => <span>{e.evaluation_date}</span> },
    { key: "approval_date", label: "Aprobación", className: tableColumnsClassname, render: (e) => e.approval_date ? <Badge variant="secondary">Aprobado</Badge> : <Badge variant="outline">Pendiente</Badge> },
  ];
  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput name="search" type="text" onChange={handleSearchChange} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar evaluaciones..." />
        <select value={ordering} onChange={handleOrderingChange} className="block w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Ordenar por">{ORDERING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      </div>
      <CustomTable<BehaviorEvaluationT> data={behaviorEvaluations} columns={columns} isLoading={isLoading && behaviorEvaluations.length === 0}
        emptyMessage={hasSearched ? "No se encontraron evaluaciones con los filtros aplicados" : "No se encontraron evaluaciones de conducta"}
        actionsTitle="Acciones" className={tableClassname} loadingMessage="Cargando evaluaciones..."
        rowActions={(e) => (<div className="flex items-center justify-end gap-1"><button type="button" onClick={() => onView(e)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Ver detalle"><Eye className="size-4" /></button><button type="button" onClick={() => onEdit(e)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Anular"><Pencil className="size-4" /></button></div>)}
      />
      <Pagination page={page} pageSize={pageSize} totalItems={behaviorEvaluations.length} isLoading={isLoading} hasNextPage={hasNextPage}
        onPageChange={(np) => { setPage(np); fetchData({ page: np }); }} onPageSizeChange={(ns) => { setPageSize(ns); setPage(1); fetchData({ page: 1, pageSize: ns }); }} />
    </div>
  );
};
