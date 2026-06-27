import { Calendar, RefreshCw, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { attendanceService } from "./attendance.service";

import type { AttendanceT } from "./attendance.types";

interface AttendanceStatsT { total: number; present: number; absent: number; late: number; justified: number; presentRate: number; }
interface AttendanceSummaryStateT { stats: AttendanceStatsT | null; recentAttendances: AttendanceT[]; loading: boolean; error: string | null; }

export default function AttendanceSummaryPage() {
  const [state, setState] = useState<AttendanceSummaryStateT>({ stats: null, recentAttendances: [], loading: true, error: null });

  const loadSummary = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { items: attendances } = await attendanceService.list({ page: 1, pageSize: 100, ordering: "-attendance_date" });
      const present = attendances.filter((a) => a.attendance_status_name === "Presente").length;
      const absent = attendances.filter((a) => a.attendance_status_name === "Ausente").length;
      const late = attendances.filter((a) => a.attendance_status_name === "Tardanza").length;
      const justified = attendances.filter((a) => a.attendance_status_name === "Justificado").length;
      const total = attendances.length;
      setState({
        stats: { total, present, absent, late, justified, presentRate: total > 0 ? Math.round((present / total) * 100) : 0 },
        recentAttendances: attendances.slice(0, 10),
        loading: false, error: null,
      });
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : "Error al cargar resumen" }));
    }
  }, []);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  const { stats, recentAttendances, loading, error } = state;

  if (loading) {
    return (
      <div className="flex animate-pulse flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="h-24 rounded-xl bg-slate-100" />))}
        </div>
        <div className="h-64 rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button type="button" onClick={loadSummary} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"><RefreshCw className="size-4" />Reintentar</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Resumen de Asistencia</h1>
          <p className="mt-1 text-sm text-slate-500">Estadísticas generales de asistencia</p>
        </div>
        <button type="button" onClick={loadSummary} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"><RefreshCw className="size-4" />Actualizar</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={<Users className="size-5" />} label="Total Registros" value={stats?.total ?? 0} color="text-slate-600" bg="bg-slate-50" />
        <StatCard icon={<Calendar className="size-5" />} label="Presentes" value={stats?.present ?? 0} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={<Calendar className="size-5" />} label="Ausentes" value={stats?.absent ?? 0} color="text-red-600" bg="bg-red-50" />
        <StatCard icon={<Calendar className="size-5" />} label="Tardanzas" value={stats?.late ?? 0} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={<Calendar className="size-5" />} label="Justificados" value={stats?.justified ?? 0} color="text-blue-600" bg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Tasa de Asistencia</h3>
          <div className="mt-3 flex items-baseline gap-2"><span className="text-4xl font-extrabold text-slate-900">{stats?.presentRate ?? 0}%</span><span className="text-sm text-slate-500">de registros son Presentes</span></div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${stats?.presentRate ?? 0}%` }} /></div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Distribución por Estado</h3>
          <div className="mt-4 space-y-3">
            <DistributionBar label="Presente" count={stats?.present ?? 0} total={stats?.total ?? 1} color="bg-emerald-500" />
            <DistributionBar label="Ausente" count={stats?.absent ?? 0} total={stats?.total ?? 1} color="bg-red-500" />
            <DistributionBar label="Tardanza" count={stats?.late ?? 0} total={stats?.total ?? 1} color="bg-amber-500" />
            <DistributionBar label="Justificado" count={stats?.justified ?? 0} total={stats?.total ?? 1} color="bg-blue-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4"><h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Últimos Registros</h3></div>
        <div className="divide-y divide-slate-100">
          {recentAttendances.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">No hay registros de asistencia</p>
          ) : (
            recentAttendances.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{a.enrollment_name}</p><p className="text-xs text-slate-500">{a.attendance_date} — {a.teacher_subject_section_name}</p></div>
                <StatusBadge status={a.attendance_status_name} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: number; color: string; bg: string; }) {
  return (<div className={`flex items-center gap-4 rounded-xl border border-slate-200 p-4 shadow-sm ${bg}`}><div className={`flex size-10 items-center justify-center rounded-lg bg-white shadow-sm ${color}`}>{icon}</div><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className={`text-2xl font-extrabold ${color}`}>{value}</p></div></div>);
}

function DistributionBar({ label, count, total, color }: { label: string; count: number; total: number; color: string; }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (<div><div className="mb-1 flex items-center justify-between text-sm"><span className="font-medium text-slate-700">{label}</span><span className="text-slate-500">{count} ({pct}%)</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} /></div></div>);
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = { Presente: "bg-emerald-50 text-emerald-700", Ausente: "bg-red-50 text-red-700", Tardanza: "bg-amber-50 text-amber-700", Justificado: "bg-blue-50 text-blue-700" };
  return (<span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${colorMap[status] || "bg-slate-50 text-slate-600"}`}>{status}</span>);
}
