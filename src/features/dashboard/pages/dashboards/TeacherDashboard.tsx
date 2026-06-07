import { Users, BookOpen, ClipboardList, AlertTriangle, Calendar } from "lucide-react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import { Badge } from "../../../../shared/components/Badge";

interface TeacherDashboardProps {
  userName?: string;
}

const myCourses = [
  {
    id: 1,
    grade: "5to Grado A",
    students: 32,
    subject: "Matemáticas",
    nextClass: "Mañana 8:00 AM",
    pendingGrades: 3,
    averageGrade: 8.7,
  },
  {
    id: 2,
    grade: "5to Grado B",
    students: 30,
    subject: "Matemáticas",
    nextClass: "Mañana 10:00 AM",
    pendingGrades: 0,
    averageGrade: 9.1,
  },
  {
    id: 3,
    grade: "6to Grado A",
    students: 28,
    subject: "Matemáticas",
    nextClass: "Vie 14:00 PM",
    pendingGrades: 1,
    averageGrade: 8.3,
  },
];

const upcomingActivities = [
  { title: "Quiz de Álgebra - 5to A", type: "Quiz", date: "25/06/2026" },
  { title: "Lección de Geometría - 6to A", type: "Lección", date: "28/06/2026" },
  { title: "Entrega de notas parciales", type: "Administrativo", date: "30/06/2026" },
];

const alerts = [
  { student: "Diego Aguilar Mora", section: "5to A | Inasistencia recurrente", level: "Alto" as const },
  { student: "Camila Jiménez León", section: "5to B | Bajo rendimiento", level: "Medio" as const },
];

export function TeacherDashboard({ userName = "Ana María López" }: TeacherDashboardProps) {
  const stats = [
    { label: "Cursos Asignados", value: myCourses.length.toString(), icon: BookOpen, color: "text-primary" },
    { label: "Total Estudiantes", value: String(myCourses.reduce((s, c) => s + c.students, 0)), icon: Users, color: "text-blue-600" },
    { label: "Notas Pendientes", value: String(myCourses.reduce((s, c) => s + c.pendingGrades, 0)), icon: ClipboardList, color: "text-orange-600" },
    { label: "Alertas Activas", value: alerts.length.toString(), icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div>
      <PageHeader
        title={`Bienvenida, ${userName}`}
        description="Docente de Matemáticas"
      />

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-2">
                  <Icon className="size-5 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-bold text-slate-800">Mis Cursos</h3>
        <div className="mt-4 space-y-4">
          {myCourses.map((course) => (
            <div key={course.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{course.grade}</h4>
                    <Badge variant="outline">{course.subject}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{course.students} estudiantes</p>
                </div>
                {course.pendingGrades > 0 && (
                  <Badge className="bg-orange-600 text-white">
                    {course.pendingGrades} pendientes
                  </Badge>
                )}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-slate-400" />
                  <div className="text-sm">
                    <p className="text-slate-500">Próxima clase</p>
                    <p className="font-medium">{course.nextClass}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardList className="size-4 text-slate-400" />
                  <div className="text-sm">
                    <p className="text-slate-500">Promedio del curso</p>
                    <p className="font-medium">{course.averageGrade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-slate-400" />
                  <div className="text-sm">
                    <p className="text-slate-500">Estudiantes</p>
                    <p className="font-medium">{course.students}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">Planificación y Actividades</h3>
          <div className="mt-4 space-y-3">
            {upcomingActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-slate-500">{activity.type}</p>
                </div>
                <span className="text-sm text-slate-500">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-800">
            <AlertTriangle className="size-5 text-red-600" />
            Estudiantes que Requieren Atención
          </h3>
          <div className="mt-4 space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="font-medium text-sm">{alert.student}</p>
                  <p className="text-xs text-slate-500">{alert.section}</p>
                </div>
                <Badge className={alert.level === "Alto" ? "bg-red-600 text-white" : "bg-orange-600 text-white"}>
                  {alert.level}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
