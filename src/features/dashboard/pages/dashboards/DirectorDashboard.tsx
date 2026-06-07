import {
  AlertTriangle, TrendingUp, CalendarCheck, HeartHandshake,
  Users, GraduationCap, UserCheck,
} from "lucide-react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import { Badge } from "../../../../shared/components/Badge";

const enrollmentData = [
  { month: "Sep", count: 320 },
  { month: "Oct", count: 345 },
  { month: "Nov", count: 380 },
  { month: "Dic", count: 412 },
  { month: "Ene", count: 440 },
  { month: "Feb", count: 458 },
];

const riskBreakdown = [
  { name: "Crítico", value: 3, color: "bg-red-600" },
  { name: "Alto", value: 8, color: "bg-orange-400" },
  { name: "Medio", value: 12, color: "bg-amber-400" },
  { name: "Bajo", value: 22, color: "bg-blue-500" },
];

const criticalAlerts = [
  { student: "Diego Aguilar Mora", section: "5to A | Inasistencia Crítica", level: "Crítico" as const },
  { student: "Ana Torres", section: "3ro B | Riesgo de Deserción", level: "Crítico" as const },
  { student: "Luis Pérez", section: "6to A | Bajo Rendimiento Extremo", level: "Alto" as const },
];

const recentIncidents = [
  { student: "Diego Aguilar Mora", description: "Pelea en zona de canchas durante el recreo principal", severity: "Grave", date: "30/05/2026" },
  { student: "Camila Jiménez León", description: "Atraso recurrente de más de 30 minutos por 3 días", severity: "Moderado", date: "28/05/2026" },
  { student: "Juan Carlos Ramírez López", description: "No presentación de tareas justificadas en Matemáticas", severity: "Leve", date: "20/05/2026" },
];

const total = riskBreakdown.reduce((s, r) => s + r.value, 0);

export function DirectorDashboard() {
  const stats = [
    { label: "Matriculados", value: "458", icon: Users, trend: "+12 este mes" },
    { label: "Docentes Activos", value: "32", icon: GraduationCap, trend: "En 12 paralelos" },
    { label: "Asistencia Global", value: "95%", icon: UserCheck, trend: "+1.5% vs mes anterior" },
    { label: "Alertas Críticas", value: "3", icon: AlertTriangle, trend: "+2 hoy" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen general del año escolar 2025-2026"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <TrendingUp className="size-3" /> {s.trend}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-100 p-2">
                  <Icon className="size-5 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-800">Evolución de Matrículas</h3>
          <div className="mt-4 flex items-end gap-2" style={{ height: 200 }}>
            {enrollmentData.map((d) => {
              const maxCount = Math.max(...enrollmentData.map((x) => x.count));
              const heightPercent = (d.count / maxCount) * 100;
              return (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs text-slate-500">{d.count}</span>
                  <div
                    className="w-full rounded-t-md bg-blue-600 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs text-slate-500">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Alertas por Nivel de Riesgo</h3>
          <div className="mt-4 space-y-3">
            {riskBreakdown.map((r) => (
              <div key={r.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{r.name}</span>
                  <span className="font-medium">{r.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${r.color}`}
                    style={{ width: `${(r.value / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-800">
            <AlertTriangle className="size-5 text-red-600" />
            Alertas Tempranas Críticas
          </h3>
          <div className="mt-4 space-y-3">
            {criticalAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-medium">{alert.student}</p>
                  <p className="text-xs text-slate-500">{alert.section}</p>
                </div>
                <Badge className={alert.level === "Crítico" ? "bg-red-600 text-white" : "bg-orange-600 text-white"}>
                  {alert.level}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-800">
            <HeartHandshake className="size-5" />
            Incidentes Recientes
          </h3>
          <div className="mt-4 space-y-3">
            {recentIncidents.map((incident, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{incident.student}</p>
                  <p className="text-xs text-slate-500 truncate">{incident.description}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <CalendarCheck className="size-3" /> {incident.date}
                  </p>
                </div>
                <Badge className={
                  incident.severity === "Grave" ? "bg-red-600 text-white" :
                  incident.severity === "Moderado" ? "bg-orange-600 text-white" :
                  "bg-yellow-600 text-white"
                }>
                  {incident.severity}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
