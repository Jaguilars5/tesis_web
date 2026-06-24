import { AlertTriangle, ArrowLeft, Info, RotateCcw } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@shared/components/Badge";

import { useRiskScoreController } from "./analytics.controller";
import {
  RISK_BAR_COLORS,
  RISK_LABEL_CONFIG,
  formatDate,
  formatRiskScore,
  getModelVersionLabel,
} from "./analytics.utils";

export default function RiskScoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedScore,
    selectedSnapshot,
    isLoading,
    error,
    loadDetail,
    loadSnapshot,
  } = useRiskScoreController();

  useEffect(() => {
    if (id) {
      loadDetail(Number(id));
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedScore) {
      loadSnapshot({
        enrollment: selectedScore.enrollment,
        academic_period: selectedScore.academic_period,
      });
    }
  }, [selectedScore]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = useCallback(() => {
    navigate("/analytics/risk-scores");
  }, [navigate]);

  const retryLoad = useCallback(() => {
    if (id) {
      loadDetail(Number(id));
    }
  }, [id, loadDetail]);

  if (isLoading && !selectedScore) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 h-6 w-64 animate-pulse rounded bg-slate-100" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (error && !selectedScore) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Volver a la lista
        </button>
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12">
          <AlertTriangle className="mb-3 size-10 text-red-400" />
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            type="button"
            onClick={retryLoad}
            className="mt-4 flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            <RotateCcw className="size-4" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!selectedScore) return null;

  const labelConfig = RISK_LABEL_CONFIG[selectedScore.risk_label];

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Volver a la lista
      </button>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-800">
              {selectedScore.enrollment_name}
            </h1>
            <p className="text-sm text-slate-500">
              {selectedScore.academic_period_name}
            </p>
          </div>
          <Badge variant={labelConfig.badgeVariant}>{labelConfig.label}</Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Puntaje de Riesgo
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${RISK_BAR_COLORS[selectedScore.risk_label]}`}
                  style={{
                    width: `${Math.min(selectedScore.risk_score, 100)}%`,
                  }}
                />
              </div>
              <span className="text-lg font-bold text-slate-800">
                {formatRiskScore(selectedScore.risk_score)}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Modelo
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {getModelVersionLabel(selectedScore.model_version)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Último Cálculo
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatDate(selectedScore.calculated_at)}
            </p>
          </div>
        </div>
      </div>

      {!selectedSnapshot && isLoading && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
        </div>
      )}

      {selectedSnapshot && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Asistencia
            </h3>
            <div className="mt-4 space-y-3">
              <DetailRow
                label="Tasa de asistencia"
                value={`${selectedSnapshot.attendance_rate}%`}
              />
              <DetailRow
                label="Ausencias consecutivas máximas"
                value={selectedSnapshot.consecutive_absences_max}
              />
              <DetailRow
                label="Tardanzas"
                value={selectedSnapshot.tardiness_count}
              />
              <DetailRow
                label="Faltas justificadas"
                value={selectedSnapshot.justified_absences}
              />
              <DetailRow
                label="Faltas injustificadas"
                value={selectedSnapshot.unjustified_absences}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Calificaciones
            </h3>
            <div className="mt-4 space-y-3">
              <DetailRow
                label="Promedio formativo (normalizado)"
                value={selectedSnapshot.formative_avg_normalized}
              />
              <DetailRow
                label="Promedio sumativo (normalizado)"
                value={selectedSnapshot.summative_avg_normalized}
              />
              <DetailRow
                label="Tendencia de notas"
                value={selectedSnapshot.grade_trend_slope}
              />
              <DetailRow
                label="Materias reprobadas"
                value={selectedSnapshot.failing_subjects_count}
              />
              <DetailRow
                label="Promedio período anterior"
                value={
                  selectedSnapshot.prev_period_avg_grade != null
                    ? selectedSnapshot.prev_period_avg_grade
                    : "Sin datos"
                }
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Conducta
            </h3>
            <div className="mt-4 space-y-3">
              <DetailRow
                label="Score de conducta"
                value={selectedSnapshot.conduct_score}
              />
              <DetailRow
                label="Incidentes graves"
                value={selectedSnapshot.severe_incidents_count}
              />
              <DetailRow
                label="Ratio de notificación familiar"
                value={
                  selectedSnapshot.family_notified_ratio != null
                    ? `${(selectedSnapshot.family_notified_ratio * 100).toFixed(0)}%`
                    : "—"
                }
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Contexto
            </h3>
            <div className="mt-4 space-y-3">
              <DetailRow
                label="Brecha edad-grado"
                value={
                  selectedSnapshot.age_grade_gap != null
                    ? `${selectedSnapshot.age_grade_gap} años`
                    : "—"
                }
              />
              <DetailRow
                label="Repitente"
                value={selectedSnapshot.is_repeat ? "Sí" : "No"}
              />
              <DetailRow
                label="Necesidades especiales"
                value={selectedSnapshot.has_special_needs ? "Sí" : "No"}
              />
            </div>
          </div>
        </div>
      )}

      {!selectedSnapshot && !isLoading && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-8 text-center">
          <Info className="mx-auto mb-2 size-8 text-slate-300" />
          <p className="text-sm text-slate-500">
            No hay datos del snapshot de características disponible para este
            período. Los datos pueden no haberse generado aún. Recalcula el
            riesgo para generar el snapshot.
          </p>
        </div>
      )}

      {selectedScore.risk_factors.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Factores de Riesgo
          </h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Factor
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Peso de Contribución
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedScore.risk_factors.map((rf) => (
                  <tr
                    key={rf.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                      {rf.risk_factor_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-orange-400"
                            style={{
                              width: `${rf.contribution_weight * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {(rf.contribution_weight * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-600" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Acerca de este análisis</p>
            <p className="mt-1">
              Este puntaje se calculó usando{" "}
              {selectedScore.model_version.includes("sklearn")
                ? "el modelo de Machine Learning (Gradient Boosting) entrenado con datos históricos. Las 16 variables mostradas arriba son las características de entrada del modelo."
                : "una fórmula ponderada basada en reglas de negocio (asistencia 35%, calificaciones 35%, conducta 30%)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value ?? "—"}</span>
    </div>
  );
}
