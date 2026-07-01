import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { Badge } from "@shared/components/Badge";
import { useStudentConduct } from "./useStudentConduct";
import { severityBadge, severityDot } from "./student.utils";

interface StudentConductPageProps {
  studentId?: number | null;
  embedded?: boolean;
}

export default function StudentConductPage({
  studentId,
  embedded = false,
}: StudentConductPageProps = {}) {
  const { evaluations, incidents, loading, error } = useStudentConduct(studentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-slate-500">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!embedded && (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Mi Conducta</h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulta tu evaluación de conducta e incidentes
            </p>
          </div>
        </div>
      )}

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {!loading && evaluations.length === 0 && incidents.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
          No hay datos de conducta disponibles
        </div>
      )}

      {evaluations.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Evaluación de Conducta
          </h3>
          {evaluations.map((e) => (
            <div key={e.id} className="mt-4 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-primary">
                  {e.final_scale ?? e.calculated_scale}
                </span>
                <span className="text-sm font-medium text-slate-600">
                  {e.final_scale_name ?? e.calculated_scale_name}
                </span>
              </div>
              {e.general_observation && (
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Observación:</span> {e.general_observation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {incidents.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
            <AlertTriangle className="size-4 text-red-500" />
            Incidentes Registrados
          </h3>
          <div className="mt-4 space-y-3">
            {incidents.map((inc) => (
              <div key={inc.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3">
                <span className={`mt-1 size-2 shrink-0 rounded-full ${severityDot(inc.severity_name)}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{inc.incident_type_name}</p>
                  <p className="text-xs text-slate-500">{inc.incident_date}</p>
                </div>
                <Badge className={severityBadge(inc.severity_name)}>
                  {inc.severity_name}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
        <Info className="mr-1 inline size-3" />
        Los incidentes y evaluaciones aquí mostrados corresponden a tu registro académico general.
      </div>
    </div>
  );
}
