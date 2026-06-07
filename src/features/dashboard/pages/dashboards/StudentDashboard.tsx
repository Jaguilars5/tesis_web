import { BookOpen, Calendar, TrendingUp, Bell } from "lucide-react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import { Badge } from "../../../../shared/components/Badge";

interface StudentDashboardProps {
  userName?: string;
}

export function StudentDashboard({ userName = "" }: StudentDashboardProps) {
  const stats = [
    { label: "Promedio General", value: "9.2", icon: TrendingUp, color: "text-primary" },
    { label: "Asistencia", value: "95%", icon: Calendar, color: "text-green-600" },
    { label: "Materias", value: "5", icon: BookOpen, color: "text-blue-600" },
    { label: "Próxima Evaluación", value: "25/06", icon: Bell, color: "text-orange-600" },
  ];

  return (
    <div>
      <PageHeader
        title={`Hola, ${userName}`}
        description="Bienvenido a tu panel de calificaciones"
      />

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-2">
                  <Icon className={`size-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Mis Próximas Evaluaciones</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="font-medium text-sm">Matemática - Quiz</p>
                <p className="text-xs text-slate-500">25/06/2026</p>
              </div>
              <Badge>Próximo</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="font-medium text-sm">Lengua y Literatura - Examen</p>
                <p className="text-xs text-slate-500">28/06/2026</p>
              </div>
              <Badge variant="secondary">En 3 días</Badge>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Resumen del Mes</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Tareas completadas</span>
              <span className="font-medium">12/12</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full w-full rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Lecciones</span>
              <span className="font-medium">8/10</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-4/5 rounded-full bg-amber-500" style={{ width: "80%" }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Exámenes</span>
              <span className="font-medium">2/2</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full w-full rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
