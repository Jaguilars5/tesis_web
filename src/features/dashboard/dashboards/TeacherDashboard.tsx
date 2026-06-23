import { AlertTriangle, BookOpen, Calendar, ClipboardList, Loader2, Users } from "lucide-react";
import { Badge } from "@shared/components/Badge";
import { PageHeader } from "@shared/components/PageHeader";
import { useTeacherDashboard } from "../useTeacherDashboard";

interface TeacherDashboardProps { userName?: string; }

export function TeacherDashboard({ userName = "" }: TeacherDashboardProps) {
  const { data, loading, error } = useTeacherDashboard();

  if (loading) return (<div><PageHeader title={`Bienvenida, ${userName}`} description="Cargando tu información..." /><div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-primary" /><span className="ml-2 text-sm text-slate-500">Cargando dashboard...</span></div></div>);
  if (error) return (<div><PageHeader title={`Bienvenida, ${userName}`} description="Docente" /><div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div></div>);
  if (!data) return (<div><PageHeader title={`Bienvenida, ${userName}`} description="Docente" /><div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">No hay datos disponibles para mostrar</div></div>);

  const totalStudents = data.courses.reduce((s, c) => s + c.students, 0);
  const totalPendingGrades = data.courses.reduce((s, c) => s + c.pendingGrades, 0);
  const stats = [
    { label: "Cursos Asignados", value: String(data.courses.length), icon: BookOpen, color: "text-primary" },
    { label: "Total Estudiantes", value: String(totalStudents), icon: Users, color: "text-blue-600" },
    { label: "Notas Pendientes", value: String(totalPendingGrades), icon: ClipboardList, color: "text-orange-600" },
    { label: "Alertas Activas", value: String(data.alerts.length), icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div>
      <PageHeader title={`Bienvenida, ${userName}`} description="Docente" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return (
        <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p></div><div className="rounded-lg bg-slate-100 p-2"><Icon className={`size-5 ${stat.color}`} /></div></div></div>
      );})}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Mis Cursos</h3>
          {data.courses.length === 0 ? <p className="mt-4 text-sm text-slate-400">Sin cursos asignados</p> : (
            <div className="mt-4 space-y-3">{data.courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div><p className="font-medium text-sm">{course.subject}</p><p className="text-xs text-slate-500">{course.grade} · {course.students} estudiantes</p></div>
                <div className="text-right"><p className="text-xs text-slate-500">{course.nextClass}</p><p className="text-xs text-orange-600">{course.pendingGrades} pendientes</p></div>
              </div>
            ))}</div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Próximas Actividades</h3>
          {data.upcomingActivities.length === 0 ? <p className="mt-4 text-sm text-slate-400">Sin actividades próximas</p> : (
            <div className="mt-4 space-y-3">{data.upcomingActivities.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-3"><Calendar className="size-4 text-slate-400" /><div><p className="font-medium text-sm">{act.title}</p><p className="text-xs text-slate-500">{act.type}</p></div></div>
                <span className="text-xs text-slate-500">{act.date}</span>
              </div>
            ))}</div>
          )}
        </div>
      </div>
      {data.alerts.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-800"><AlertTriangle className="size-5 text-red-600" />Alertas Recientes</h3>
          <div className="mt-4 space-y-3">{data.alerts.map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 p-3"><div><p className="text-sm font-medium">{alert.student}</p><p className="text-xs text-slate-500">{alert.section}</p></div><Badge variant={alert.level === "Alto" ? "destructive" : "secondary"}>{alert.level}</Badge></div>
          ))}</div>
        </div>
      )}
    </div>
  );
}
