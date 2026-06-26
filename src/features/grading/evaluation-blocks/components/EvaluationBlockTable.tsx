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
  EvaluationBlockListParamsT,
  EvaluationBlockOrderingT,
  EvaluationBlockT,
} from "../evaluation-blocks.types";

const OrderingOptions: { label: string; value: EvaluationBlockOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Código (A-Z)", value: "code" },
  { label: "Código (Z-A)", value: "-code" },
  { label: "% (asc)", value: "weight_percentage" },
  { label: "% (desc)", value: "-weight_percentage" },
  { label: "Período (A-Z)", value: "academic_period_name" },
  { label: "Período (Z-A)", value: "-academic_period_name" },
];

interface EvaluationBlockTableProps {
  evaluationBlocks: EvaluationBlockT[];
  isLoading: boolean;
  loadEvaluationBlocks: (params?: EvaluationBlockListParamsT) => void;
  onEdit: (s: EvaluationBlockT) => void;
  onView: (s: EvaluationBlockT) => void;
  onDelete: (s: EvaluationBlockT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const EvaluationBlockTable: React.FC<EvaluationBlockTableProps> = ({
  evaluationBlocks,
  isLoading,
  loadEvaluationBlocks,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<EvaluationBlockOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (params?: EvaluationBlockListParamsT) => {
      loadEvaluationBlocks(params);
    },
    [loadEvaluationBlocks],
  );

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearch(v);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => { fetchData({ page: 1, search: v || undefined }); }, 400);
    },
    [fetchData],
  );

  const handleOrdering = useCallback(
    (value: EvaluationBlockOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, ordering: value });
    },
    [fetchData],
  );

  const hasNextPage = evaluationBlocks.length >= pageSize;

  const columns: TableColumnProps<EvaluationBlockT>[] = [
    { key: "name", label: "Nombre", className: tableFirstColumnClassname, render: (s) => <span>{s.name}</span> },
    { key: "academic_period_name", label: "Período", className: tableColumnsClassname },
    { key: "weight_percentage", label: "%", className: tableColumnsClassname, render: (s) => <span>{s.weight_percentage}%</span> },
    { key: "is_active", label: "Estado", className: tableColumnsClassname, render: (s) => s.is_active ? <Badge variant="default">Activo</Badge> : <Badge variant="outline">Inactivo</Badge> },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput name="search" type="text" onChange={handleSearch} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar bloques..." />
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
      <Pagination page={page} pageSize={pageSize} totalItems={evaluationBlocks.length} isLoading={isLoading} hasNextPage={hasNextPage}
        onPageChange={(np) => { setPage(np); fetchData({ page: np }); }}
        onPageSizeChange={(ns) => { setPageSize(ns); setPage(1); fetchData({ page: 1, pageSize: ns }); }} />
    </div>
  );
};
