import { Calendar } from "lucide-react";
import { useEffect, useReducer, useState } from "react";

import { tableClassname, tableColumnsClassname, tableFirstColumnClassname } from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";
import { Pagination } from "@shared/components/Pagination";
import { teacherService } from "./teacher.service";
import type { TableColumnProps } from "@shared/components/Table";
import type { TeacherActivityViewT } from "./teacher.types";

interface State { activities: TeacherActivityViewT[]; loading: boolean; error: string | null; }
type Action = { type: "loading" } | { type: "success"; items: TeacherActivityViewT[] } | { type: "error"; error: string };
function reducer(_s: State, a: Action): State { switch (a.type) { case "loading": return { activities: [], loading: true, error: null }; case "success": return { activities: a.items, loading: false, error: null }; case "error": return { activities: [], loading: false, error: a.error }; } }

export default function TeacherActivitiesPage() {
  const [state, dispatch] = useReducer(reducer, { activities: [], loading: true, error: null });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => { let c = false; dispatch({ type: "loading" }); teacherService.listActivities({ page: 1, pageSize: 100 }).then((items) => { if (!c) dispatch({ type: "success", items }); }).catch((err) => { if (!c) dispatch({ type: "error", error: err.message }); }); return () => { c = true; }; }, []);

  const hnp = state.activities.length >= pageSize;
  const cols: TableColumnProps<TeacherActivityViewT>[] = [
    { key: "title", label: "Actividad", className: tableFirstColumnClassname },
    { key: "max_score", label: "Puntaje Máx", className: tableColumnsClassname },
    { key: "due_date", label: "Fecha Límite", className: tableColumnsClassname, render: (a) => (<span className="inline-flex items-center gap-1"><Calendar className="size-3.5 text-slate-400" />{a.due_date}</span>) },
    { key: "is_active", label: "Estado", className: tableColumnsClassname, render: (a) => a.is_active ? <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" />Activo</span> : <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Inactivo</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Actividades</h1>
          <p className="mt-1 text-sm text-slate-500">Gestión de actividades evaluativas</p>
        </div>
      </div>
      {state.error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{state.error}</div>}
      <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
        <CustomTable<TeacherActivityViewT> data={state.activities} columns={cols} isLoading={state.loading && state.activities.length === 0} emptyMessage="No se encontraron actividades" className={tableClassname} loadingMessage="Cargando actividades..." />
        <Pagination page={page} pageSize={pageSize} totalItems={state.activities.length} isLoading={state.loading} hasNextPage={hnp} onPageChange={(np) => { setPage(np); }} onPageSizeChange={() => {}} />
      </div>
      {state.activities.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Resumen</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center"><p className="text-2xl font-extrabold text-blue-600">{state.activities.length}</p><p className="text-xs font-medium text-blue-700">Total Actividades</p></div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center"><p className="text-2xl font-extrabold text-emerald-600">{state.activities.filter((a) => a.is_active).length}</p><p className="text-xs font-medium text-emerald-700">Activas</p></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center"><p className="text-2xl font-extrabold text-slate-600">{state.activities.filter((a) => !a.is_active).length}</p><p className="text-xs font-medium text-slate-700">Inactivas</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
