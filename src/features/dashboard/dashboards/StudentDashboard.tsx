import { BookOpen, TrendingUp, CalendarCheck, AlertTriangle, Loader2 } from "lucide-react";
import { PageHeader } from "@shared/components/PageHeader";
import { Badge } from "@shared/components/Badge";
import { useStudentDashboard } from "../useStudentDashboard";
import { averageBadge } from "@features/student/student.utils";

interface StudentDashboardProps { userName?: string; }

export function StudentDashboard({ userName = "" }: StudentDashboardProps) {
  const { data, loading, error } = useStudentDashboard();

  if (loading) return (<div><PageHeader title={`Hola, ${userName}`} description="Cargando tu información..." /><div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-primary" /><span className="ml-2 text-sm text-slate-500">Cargando dashboard...</span></div></div>);
  if (error) return (<div><PageHeader title={`Hola, ${userName}`} description="Bienvenido a tu panel" /><div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div></div>);
  if (!data) return (<div><PageHeader title={`Hola, ${userName}`} description="Bienvenido a tu panel" /><div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">No hay datos disponibles para mostrar</div></div>);

  const { overallAverage, attendanceRate, attendanceSummary, totalSubjects, recoverySubjects, subjects, conductEval } = data;

  const stats = [
    { label: "Promedio General", value: overallAverage !== null ? `${overallAverage}/10` : "—", icon: TrendingUp, color: overallAverage !== null && overallAverage >= 7 ? "text-primary" : "text-amber-600" },
    { label: "Asistencia", value: attendanceRate !== null ? `${attendanceRate}%` : "—", icon: CalendarCheck, color: attendanceRate !== null && attendanceRate >= 80 ? "text-green-600" : "text-red-600" },
    { label: "Materias", value: String(totalSubjects), icon: BookOpen, color: "text-blue-600" },
    { label: "Recuperaciones", value: recoverySubjects > 0 ? String(recoverySubjects) : "0", icon: AlertTriangle, color: recoverySubjects > 0 ? "text-red-600" : "text-green-600" },
  ];

  return (
    <div>
      <PageHeader title={`Hola, ${userName}`} description={`Sección: ${data.enrollment.section_name}`} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">{stats.map((stat, index) => { const Icon = stat.icon; return (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p></div><div className="rounded-lg bg-slate-100 p-2"><Icon className={`size-5 ${stat.color}`} /></div></div></div>
      );})}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Resumen de Calificaciones</h3>
          {subjects.length === 0 ? <p className="mt-4 text-sm text-slate-400">Sin calificaciones registradas</p> : (
            <div className="mt-4 space-y-2">{subjects.map((subject) => (<div key={subject.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-3"><span className="text-sm font-medium text-slate-700 truncate">{subject.name}</span><div className="flex items-center gap-2 shrink-0">{subject.average !== null ? <Badge className={averageBadge(subject.average)}>{subject.average}</Badge> : <span className="text-xs text-slate-400">—</span>}{subject.isFailing && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">R</Badge>}</div></div>))}</div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Resumen de Asistencia</h3>
          {attendanceSummary.total === 0 ? <p className="mt-4 text-sm text-slate-400">Sin registros de asistencia</p> : (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center"><p className="text-xl font-extrabold text-green-600">{attendanceSummary.present}</p><p className="text-xs font-medium text-green-700">Presentes</p></div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center"><p className="text-xl font-extrabold text-red-600">{attendanceSummary.absent}</p><p className="text-xs font-medium text-red-700">Ausencias</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center"><p className="text-xl font-extrabold text-amber-600">{attendanceSummary.late}</p><p className="text-xs font-medium text-amber-700">Atrasos</p></div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center"><p className="text-xl font-extrabold text-slate-600">{attendanceSummary.total}</p><p className="text-xs font-medium text-slate-700">Total</p></div>
              </div>
              <div className="mt-3"><div className="flex items-center justify-between text-sm mb-1"><span className="text-slate-600">Tasa de asistencia</span><span className="font-semibold text-slate-800">{attendanceRate}%</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${attendanceRate !== null && attendanceRate >= 80 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${attendanceRate ?? 0}%` }} /></div></div>
            </div>
          )}
          {conductEval && (<div className="mt-5 pt-4 border-t border-slate-100"><h4 className="text-sm font-semibold text-slate-700 mb-2">Evaluación de Conducta</h4><div className="flex items-baseline gap-2"><span className="text-2xl font-extrabold text-primary">{conductEval.scale}</span><span className="text-sm font-medium text-slate-600">{conductEval.scaleName}</span></div></div>)}
        </div>
      </div>
    </div>
  );
}
