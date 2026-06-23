import { Users, AlertTriangle, Calendar, Bell } from "lucide-react";
import { PageHeader } from "@shared/components/PageHeader";
import { Badge } from "@shared/components/Badge";

interface RepresentativeDashboardProps { userName?: string; }

export function RepresentativeDashboard({ userName = "" }: RepresentativeDashboardProps) {
  const stats = [
    { label: "Hijos/Representados", value: "2", icon: Users, color: "text-primary" },
    { label: "Alertas Activas", value: "2", icon: AlertTriangle, color: "text-red-600" },
    { label: "Asistencia Global", value: "95%", icon: Calendar, color: "text-green-600" },
    { label: "Pendientes", value: "1", icon: Bell, color: "text-orange-600" },
  ];

  return (
    <div>
      <PageHeader title={`Bienvenido, ${userName}`} description="Panel de seguimiento académico" />
      <div className="grid gap-4 md:grid-cols-4 mb-6">{stats.map((stat, index) => { const Icon = stat.icon; return (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p></div><div className="rounded-lg bg-slate-100 p-2"><Icon className={`size-5 ${stat.color}`} /></div></div></div>
      );})}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Resumen Académico</h3>
          <div className="mt-4 space-y-3"><div className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><div><p className="font-medium text-sm">María José Ramírez López</p><p className="text-xs text-slate-500">5to Grado - Sección A</p></div><Badge>Promedio: 9.2</Badge></div><div className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><div><p className="font-medium text-sm">Juan Carlos Ramírez López</p><p className="text-xs text-slate-500">3er Grado - Sección B</p></div><Badge>Promedio: 8.5</Badge></div></div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Alertas de Asistencia</h3>
          <div className="mt-4 space-y-3"><div className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><div><p className="font-medium text-sm">Juan Carlos Ramírez</p><p className="text-xs text-slate-500">85% asistencia - Umbral bajo</p></div><Badge variant="destructive">Alerta</Badge></div></div>
        </div>
      </div>
    </div>
  );
}
