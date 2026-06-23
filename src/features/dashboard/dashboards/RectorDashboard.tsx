import { AlertTriangle, Users, GraduationCap, CalendarCheck, TrendingUp } from "lucide-react";
import { PageHeader } from "@shared/components/PageHeader";
import { Badge } from "@shared/components/Badge";

interface RectorDashboardProps { userName?: string; }

const enrollmentData = [
  { month: "Sep", count: 320 }, { month: "Oct", count: 345 }, { month: "Nov", count: 380 },
  { month: "Dic", count: 412 }, { month: "Ene", count: 440 }, { month: "Feb", count: 458 },
];

export function RectorDashboard({ userName = "" }: RectorDashboardProps) {
  const stats = [
    { label: "Matrícula Total", value: "458", icon: Users, trend: "+12 este mes" },
    { label: "Personal Docente", value: "32", icon: GraduationCap, trend: "En 12 paralelos" },
    { label: "Asistencia Global", value: "95%", icon: CalendarCheck, trend: "+1.5% vs mes anterior" },
    { label: "Alertas Críticas", value: "3", icon: AlertTriangle, trend: "+2 hoy" },
  ];

  return (
    <div>
      <PageHeader title={`Bienvenido, ${userName}`} description="Panel de gestión institucional" />
      <div className="grid gap-4 md:grid-cols-4 mb-6">{stats.map((stat, index) => { const Icon = stat.icon; return (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-2 text-2xl font-bold text-slate-800">{stat.value}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><TrendingUp className="size-3" /> {stat.trend}</p></div><div className="rounded-lg bg-slate-100 p-2"><Icon className="size-5 text-primary" /></div></div></div>
      );})}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Matrícula por Mes</h3>
          <div className="mt-4 flex items-end gap-2" style={{ height: 200 }}>{enrollmentData.map((d) => { const maxCount = Math.max(...enrollmentData.map((x) => x.count)); const h = (d.count / maxCount) * 100; return (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-1"><span className="text-xs text-slate-500">{d.count}</span><div className="w-full rounded-t-md bg-blue-500 transition-all" style={{ height: `${h}%` }} /><span className="text-xs text-slate-500">{d.month}</span></div>
          );})}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Resumen de Alertas</h3>
          <div className="mt-4 space-y-3"><div className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><span className="text-sm">Críticas</span><Badge variant="destructive">3</Badge></div><div className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><span className="text-sm">Altas</span><Badge>8</Badge></div><div className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><span className="text-sm">Medias</span><Badge variant="secondary">12</Badge></div></div>
        </div>
      </div>
    </div>
  );
}
