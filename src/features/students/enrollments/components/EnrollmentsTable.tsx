import { Eye, Pencil, Trash2 } from "lucide-react"; import { useCallback, useEffect, useRef, useState } from "react";
import { filterSelectClassname, tableClassname, tableColumnsClassname, tableFirstColumnClassname } from "@app/styles/styles"; import { Badge } from "@shared/components/Badge";
import { CustomSelect } from "@shared/components/Form/CustomSelect/CustomSelect"; import { SearchInput } from "@shared/components/Form"; import { Pagination } from "@shared/components/Pagination"; import { CustomTable } from "@shared/components/Table";
import { useEnrollmentFilterCatalogs } from "../enrollments.options";
import { getStatusConfig, formatDate } from "../enrollments.utils";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps"; import type { TableColumnProps } from "@shared/components/Table"; import type { EnrollmentListParamsT, EnrollmentOrderingT, EnrollmentT } from "../enrollments.types";

const O: { label: string; value: EnrollmentOrderingT }[] = [
  { label: "Estudiante (A-Z)", value: "student_name" }, { label: "Estudiante (Z-A)", value: "-student_name" },
  { label: "Curso (A-Z)", value: "section_name" }, { label: "Curso (Z-A)", value: "-section_name" },
  { label: "Fecha (asc)", value: "enrollment_date" }, { label: "Fecha (desc)", value: "-enrollment_date" },
  { label: "Estado", value: "enrollment_status" }, { label: "Estado (desc)", value: "-enrollment_status" },
];

type Props = { enrollments: EnrollmentT[]; isLoading: boolean; loadEnrollments: (p?: EnrollmentListParamsT) => void; onEdit: (e: EnrollmentT) => void; onView: (e: EnrollmentT) => void; onDelete: (e: EnrollmentT) => void; };

export const EnrollmentsTable = ({ enrollments, isLoading, loadEnrollments, onEdit, onView, onDelete }: Props) => {
  const [search, setSearch] = useState(""); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10); const [ordering, setOrdering] = useState<EnrollmentOrderingT>("student_name"); const [hasSearched, setHasSearched] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<number | 0>(0); const [statusFilter, setStatusFilter] = useState<string>(""); const [studentFilter, setStudentFilter] = useState<number | 0>(0);
  const { sectionOptions, studentOptions, statusOptions } = useEnrollmentFilterCatalogs();
  const dr = useRef<ReturnType<typeof setTimeout>>(undefined);
  const buildFilters = useCallback(() => {
    const f: Record<string, string | number | boolean> = {};
    if (sectionFilter) f.section = sectionFilter;
    if (statusFilter) f.enrollment_status = statusFilter;
    if (studentFilter) f.student = studentFilter;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [sectionFilter, statusFilter, studentFilter]);
  const fetchData = useCallback((o?: { page?: number; pageSize?: number; search?: string; ordering?: EnrollmentOrderingT; filters?: Record<string, string | number | boolean> }) => { loadEnrollments({ page: o?.page ?? page, pageSize: o?.pageSize ?? pageSize, search: o?.search !== undefined ? o.search : search || undefined, ordering: o?.ordering ?? ordering, filters: o?.filters ?? buildFilters() }); }, [loadEnrollments, page, pageSize, search, ordering, buildFilters]);
  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const hSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setSearch(v); setPage(1); setHasSearched(true); if (dr.current) clearTimeout(dr.current); dr.current = setTimeout(() => { fetchData({ page: 1, search: v || undefined }); }, 400); }, [fetchData]);
  const hOrder = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => { const n = e.target.value as EnrollmentOrderingT; setOrdering(n); setPage(1); fetchData({ page: 1, ordering: n }); }, [fetchData]);
  const hSection = useCallback((o: SelectOptionT) => { setSectionFilter(Number(o.value) || 0); setPage(1); }, []);
  const hStatus = useCallback((o: SelectOptionT) => { setStatusFilter(o.value as string); setPage(1); }, []);
  const hStudent = useCallback((o: SelectOptionT) => { setStudentFilter(Number(o.value) || 0); setPage(1); }, []);
  useEffect(() => { fetchData({ page: 1 }); }, [sectionFilter, statusFilter, studentFilter]); // eslint-disable-line react-hooks/exhaustive-deps
  const hnp = enrollments.length >= pageSize;
  const cols: TableColumnProps<EnrollmentT>[] = [
    { key: "student_name", label: "Estudiante", className: tableFirstColumnClassname },
    { key: "section_name", label: "Curso", className: tableColumnsClassname },
    { key: "enrollment_date", label: "Fecha Matrícula", className: tableColumnsClassname, render: (e) => <span>{formatDate(e.enrollment_date)}</span> },
    { key: "enrollment_status", label: "Estado", className: tableColumnsClassname, render: (e) => { const cfg = getStatusConfig(e.enrollment_status); return <Badge variant={cfg.badge as "default" | "secondary" | "outline"}><span className={`mr-1.5 inline-block size-2 rounded-full ${cfg.dot}`} />{cfg.label}</Badge>; } },
  ];
  return (<div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3"><SearchInput name="search" type="text" onChange={hSearch} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar matrículas..." /><CustomSelect name="filter-section" label="" placeholder="Todos los cursos" value={sectionFilter} options={sectionOptions} onChange={hSection} className={filterSelectClassname} /><CustomSelect name="filter-status" label="" placeholder="Todos los estados" value={statusFilter} options={statusOptions} onChange={hStatus} className={filterSelectClassname} /><CustomSelect name="filter-student" label="" placeholder="Todos los estudiantes" value={studentFilter} options={studentOptions} onChange={hStudent} className={filterSelectClassname} /><select value={ordering} onChange={hOrder} className="block w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">{O.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div><CustomTable<EnrollmentT> data={enrollments} columns={cols} isLoading={isLoading && enrollments.length === 0} emptyMessage={hasSearched ? "No se encontraron matrículas con los filtros" : "No se encontraron matrículas"} actionsTitle="Acciones" className={tableClassname} loadingMessage="Cargando..." rowActions={(e) => (<div className="flex items-center justify-end gap-1"><button type="button" onClick={() => onView(e)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100" title="Ver"><Eye className="size-4" /></button><button type="button" onClick={() => onEdit(e)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100" title="Editar"><Pencil className="size-4" /></button><button type="button" onClick={() => onDelete(e)} className="inline-flex items-center justify-center rounded-md p-2 text-red-400 hover:bg-red-50" title="Desactivar"><Trash2 className="size-4" /></button></div>)} /><Pagination page={page} pageSize={pageSize} totalItems={enrollments.length} isLoading={isLoading} hasNextPage={hnp} onPageChange={(np) => { setPage(np); fetchData({ page: np }); }} onPageSizeChange={(ns) => { setPageSize(ns); setPage(1); fetchData({ page: 1, pageSize: ns }); }} /></div>);
};
