import { ClipboardCheck, Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GRADING_ROUTES } from "@features/grading/grading.routes";
import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomSelect, SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import { useEvaluativeActivityOptions } from "../hooks/useEvaluativeActivityOptions";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  EvaluativeActivityListParamsT,
  EvaluativeActivityOrderingT,
  EvaluativeActivityT,
} from "../evaluative-activities.types";

const OrderingOptions: { label: string; value: EvaluativeActivityOrderingT }[] = [
  { label: "Título (A-Z)", value: "title" },
  { label: "Título (Z-A)", value: "-title" },
  { label: "Fecha (asc)", value: "due_date" },
  { label: "Fecha (desc)", value: "-due_date" },
];

interface EvaluativeActivityTableProps {
  evaluativeActivities: EvaluativeActivityT[];
  isLoading: boolean;
  loadEvaluativeActivities: (params?: EvaluativeActivityListParamsT) => void;
  onEdit: (s: EvaluativeActivityT) => void;
  onView: (s: EvaluativeActivityT) => void;
  onDelete: (s: EvaluativeActivityT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const EvaluativeActivityTable: React.FC<EvaluativeActivityTableProps> = ({
  evaluativeActivities,
  isLoading,
  loadEvaluativeActivities,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const navigate = useNavigate();
  const { teacherSubjectSectionOptions, academicPeriodOptions } = useEvaluativeActivityOptions();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<EvaluativeActivityOrderingT>("due_date");
  const [hasSearched, setHasSearched] = useState(false);
  const [tssFilter, setTssFilter] = useState<number | 0>(0);
  const [periodFilter, setPeriodFilter] = useState<number | 0>(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(() => {
    const f: { teacher_subject_section?: number; academic_period?: number } = {};
    if (tssFilter) f.teacher_subject_section = tssFilter;
    if (periodFilter) f.academic_period = periodFilter;
    return f;
  }, [tssFilter, periodFilter]);

  const fetchData = useCallback(
    (params?: EvaluativeActivityListParamsT) => {
      loadEvaluativeActivities(params);
    },
    [loadEvaluativeActivities],
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
    (value: EvaluativeActivityOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, ordering: value, search: search || undefined, filters: buildFilters() });
    },
    [fetchData, search, buildFilters],
  );

  const handleTssFilterChange = useCallback(
    (value: number) => {
      setTssFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { teacher_subject_section: value || undefined, academic_period: periodFilter || undefined } });
    },
    [fetchData, ordering, search, periodFilter],
  );

  const handlePeriodFilterChange = useCallback(
    (value: number) => {
      setPeriodFilter(value);
      setPage(1);
      fetchData({ page: 1, ordering, search: search || undefined, filters: { teacher_subject_section: tssFilter || undefined, academic_period: value || undefined } });
    },
    [fetchData, ordering, search, tssFilter],
  );

  const goToGradebook = useCallback(
    (s: EvaluativeActivityT) => { navigate(`${GRADING_ROUTES.GRADEBOOK}?tss=${s.teacher_subject_section}&activity=${s.id}`); },
    [navigate],
  );

  const hasNextPage = evaluativeActivities.length >= pageSize;

  const columns: TableColumnProps<EvaluativeActivityT>[] = [
    { key: "title", label: "Título", className: tableFirstColumnClassname },
    { key: "teacher_subject_section_name", label: "Docente-Materia", className: tableColumnsClassname },
    { key: "max_score", label: "Punt. Máx.", className: tableColumnsClassname },
    { key: "due_date", label: "Vencimiento", className: tableColumnsClassname },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput name="search" type="text" onChange={handleSearch} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar actividades..." />
        <CustomSelect name="filter-tss" label="" placeholder="Todos los docentes" value={tssFilter} options={teacherSubjectSectionOptions} onChange={(option) => handleTssFilterChange(option.value ? Number(option.value) : 0)} className={filterSelectClassname} />
        <CustomSelect name="filter-period" label="" placeholder="Todos los períodos" value={periodFilter} options={academicPeriodOptions} onChange={(option) => handlePeriodFilterChange(option.value ? Number(option.value) : 0)} className={filterSelectClassname} />
        <CustomSelect name="ordering" label="" placeholder="Ordenar" value={ordering} options={OrderingOptions} onChange={(option) => handleOrdering(option.value as EvaluativeActivityOrderingT)} className={filterSelectClassname} />
      </div>
      <CustomTable<EvaluativeActivityT> data={evaluativeActivities} columns={columns} isLoading={isLoading && evaluativeActivities.length === 0}
        emptyMessage={hasSearched ? "No se encontraron actividades con los filtros" : "No se encontraron actividades evaluativas"}
        actionsTitle="Acciones" className={tableClassname} loadingMessage="Cargando..."
        rowActions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => goToGradebook(s)} className="inline-flex items-center justify-center rounded-md p-2 text-emerald-500 hover:bg-emerald-50" title="Calificar"><ClipboardCheck className="size-4" /></button>
            <button type="button" onClick={() => onView(s)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100" title="Ver"><Eye className="size-4" /></button>
            {canEdit && <button type="button" onClick={() => onEdit(s)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100" title="Editar"><Pencil className="size-4" /></button>}
            {canDelete && <button type="button" onClick={() => onDelete(s)} className="inline-flex items-center justify-center rounded-md p-2 text-red-400 hover:bg-red-50" title="Desactivar"><Trash2 className="size-4" /></button>}
          </div>
        )}
      />
      <Pagination page={page} pageSize={pageSize} totalItems={evaluativeActivities.length} isLoading={isLoading} hasNextPage={hasNextPage}
        onPageChange={(np) => { setPage(np); fetchData({ page: np, ordering, search: search || undefined, filters: buildFilters() }); }}
        onPageSizeChange={(ns) => { setPageSize(ns); setPage(1); fetchData({ page: 1, pageSize: ns, ordering, search: search || undefined, filters: buildFilters() }); }} />
    </div>
  );
};
