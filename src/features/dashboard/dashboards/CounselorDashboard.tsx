import { AlertTriangle, Users, TrendingUp, BookOpen } from "lucide-react";
import { PageHeader } from "@shared/components/PageHeader";
import { Badge } from "@shared/components/Badge";

interface CounselorDashboardProps { userName?: string; }

const criticalAlerts = [
  { student: "Diego Aguilar Mora", type: "Inasistencia Crítica", level: "Crítico" as const },
  { student: "Ana Torres Rivera", type: "Riesgo de Deserción", level: "Crítico" as const },
  { student: "María José Ramírez", type: "Bajo Rendimiento Extremo", level: "Alto" as const },
];

const atRiskStudents = [
  { names: "Diego Aguilar", apellidos: "Mora", grado: "5to Grado", seccion: "A" },
  { names: "Ana", apellidos: "Torres Rivera", grado: "3er Grado", seccion: "B" },
  { names: "Camila", apellidos: "Jiménez León", grado: "5to Grado", seccion: "B" },
  { names: "Luis", apellidos: "Pérez Gómez", grado: "6to Grado", seccion: "A" },
  { names: "Sofía", apellidos: "Martínez Ruiz", grado: "4to Grado", seccion: "C" },
];

export function CounselorDashboard({ userName = "" }: CounselorDashboardProps) {
  const stats = [
    { label: "Total Estudiantes", value: "458", icon: Users, color: "text-primary" },
    { label: "Alertas Activas", value: "23", icon: AlertTriangle, color: "text-red-600" },
    { label: "Casos Críticos", value: "3", icon: TrendingUp, color: "text-orange-600" },
    { label: "En Seguimiento", value: "12", icon: BookOpen, color: "text-blue-600" },
  ];

  return (
    <div>
      <PageHeader title={`Bienvenido, ${userName}`} description="Panel de intervención y seguimiento DECE" />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {stats.map((stat, index) => { const Icon = stat.icon; return (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p></div>
              <div className="rounded-lg bg-slate-100 p-2"><Icon className={`size-5 ${stat.color}`} /></div>
            </div>
          </div>
        );})}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Alertas Críticas Recientes</h3>
          <div className="mt-4 space-y-3">{criticalAlerts.map((alert, idx) => (<div key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><div><p className="font-medium text-sm">{alert.student}</p><p className="text-xs text-slate-500">{alert.type}</p></div><Badge variant="destructive">{alert.level}</Badge></div>))}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Estudiantes en Riesgo</h3>
          <div className="mt-4 space-y-3">{atRiskStudents.map((student, idx) => (<div key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><div><p className="font-medium text-sm">{student.names} {student.apellidos}</p><p className="text-xs text-slate-500">{student.grado} - {student.seccion}</p></div><Badge variant="secondary">En riesgo</Badge></div>))}</div>
        </div>
      </div>
    </div>
  );
}
