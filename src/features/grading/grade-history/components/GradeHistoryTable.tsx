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

import type { TableColumnProps } from "@shared/components/Table";
import type {
  GradeChangeHistoryListParamsT,
  GradeChangeHistoryOrderingT,
  GradeChangeHistoryT,
} from "../grade-history.types";

const OrderingOptions: { label: string; value: GradeChangeHistoryOrderingT }[] = [
  { label: "Fecha (asc)", value: "modified_at" },
  { label: "Fecha (desc)", value: "-modified_at" },
  { label: "Antes (asc)", value: "previous_score" },
  { label: "Antes (desc)", value: "-previous_score" },
  { label: "Nuevo (asc)", value: "new_score" },
  { label: "Nuevo (desc)", value: "-new_score" },
];

interface GradeHistoryTableProps {
  gradeHistoryItems: GradeChangeHistoryT[];
  totalCount: number;
  isLoading: boolean;
  loadGradeHistory: (params?: GradeChangeHistoryListParamsT) => void;
}

export const GradeHistoryTable: React.FC<GradeHistoryTableProps> = ({
  gradeHistoryItems,
  totalCount,
  isLoading,
  loadGradeHistory,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<GradeChangeHistoryOrderingT>("-modified_at");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (params?: GradeChangeHistoryListParamsT) => {
      loadGradeHistory(params);
    },
    [loadGradeHistory],
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
    (value: GradeChangeHistoryOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, ordering: value });
    },
    [fetchData],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<GradeChangeHistoryT>[] = [
    { key: "student_note_name", label: "Nota", className: tableFirstColumnClassname },
    { key: "modified_by_user_name", label: "Modificado por", className: tableColumnsClassname },
    { key: "previous_score", label: "Antes", className: tableColumnsClassname, render: (s) => <span>{s.previous_score}</span> },
    { key: "new_score", label: "Nuevo", className: tableColumnsClassname, render: (s) => <span>{s.new_score}</span> },
    { key: "reason", label: "Motivo", className: tableColumnsClassname, render: (s) => <span>{s.reason}</span> },
    { key: "modified_at", label: "Fecha", className: tableColumnsClassname, render: (s) => <span>{s.modified_at}</span> },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput name="search" type="text" onChange={handleSearch} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar historial..." />
        <CustomSelect name="ordering" label="" placeholder="Ordenar" value={ordering} options={OrderingOptions} onChange={(option) => handleOrdering(option.value as GradeChangeHistoryOrderingT)} className={filterSelectClassname} />
      </div>
      <CustomTable<GradeChangeHistoryT> data={gradeHistoryItems} columns={columns} isLoading={isLoading && gradeHistoryItems.length === 0}
        emptyMessage={hasSearched ? "No se encontraron registros con los filtros" : "No se encontraron registros de historial"}
        className={tableClassname} loadingMessage="Cargando historial..." />
      <Pagination page={page} pageSize={pageSize} totalItems={totalCount} isLoading={isLoading} hasNextPage={hasNextPage}
        onPageChange={(np) => { setPage(np); fetchData({ page: np }); }}
        onPageSizeChange={(ns) => { setPageSize(ns); setPage(1); fetchData({ page: 1, pageSize: ns }); }} />
    </div>
  );
};
