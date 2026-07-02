import { useFormik } from "formik";
import {
  AlertTriangle,
  Beaker,
  ChevronRight,
  FlaskConical,
  Scale,
  BookOpen,
  GraduationCap,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";
import { useModelEvaluatorController } from "./model-evaluator.controller";
import { simulateSchema } from "./model-evaluator.utils";
import type { SimulateParamsT, SimulateMlSuccessT } from "./model-evaluator.types";
import { inputClassname } from "@app/styles/styles";

const INITIAL_VALUES: SimulateParamsT = {
  attendance_rate: 85,
  average_grade: 7,
  failing_subjects_count: 0,
  severe_incidents_count: 0,
  mild_incidents_count: 0,
  consecutive_absences_max: 0,
  tardiness_count: 0,
  justified_absences: 0,
  unjustified_absences: 0,
  grade_trend_slope: 0,
  family_notified_ratio: 0,
  prev_period_avg_grade: 0,
  age_grade_gap: 0,
  is_repeat: false,
  has_special_needs: false,
};

interface ScenarioPreset {
  label: string;
  description: string;
  icon: typeof UserCheck;
  color: string;
  values: Partial<SimulateParamsT>;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    label: "Bajo riesgo",
    description: "Asiste regularmente, buenas notas, sin incidentes",
    icon: UserCheck,
    color: "border-green-400 hover:bg-green-50",
    values: {
      attendance_rate: 95,
      average_grade: 8.5,
      failing_subjects_count: 0,
      severe_incidents_count: 0,
      mild_incidents_count: 1,
      tardiness_count: 1,
    },
  },
  {
    label: "Alerta por asistencia",
    description: "Inasistencia recurrente (>15%)",
    icon: AlertCircle,
    color: "border-amber-400 hover:bg-amber-50",
    values: {
      attendance_rate: 72,
      average_grade: 7.5,
      failing_subjects_count: 1,
      severe_incidents_count: 0,
      mild_incidents_count: 2,
      consecutive_absences_max: 4,
      unjustified_absences: 10,
    },
  },
  {
    label: "Alerta por calificaciones",
    description: "Promedio bajo (<6) y varias materias perdidas",
    icon: BookOpen,
    color: "border-amber-400 hover:bg-amber-50",
    values: {
      attendance_rate: 88,
      average_grade: 5.8,
      failing_subjects_count: 3,
      severe_incidents_count: 0,
      mild_incidents_count: 2,
      grade_trend_slope: -1.5,
    },
  },
  {
    label: "Alerta por conducta",
    description: "Múltiples incidentes graves y leves",
    icon: AlertTriangle,
    color: "border-orange-400 hover:bg-orange-50",
    values: {
      attendance_rate: 90,
      average_grade: 7.5,
      failing_subjects_count: 0,
      severe_incidents_count: 4,
      mild_incidents_count: 8,
    },
  },
  {
    label: "Alto riesgo",
    description: "Combinación crítica en las 3 dimensiones",
    icon: UserX,
    color: "border-red-400 hover:bg-red-50",
    values: {
      attendance_rate: 55,
      average_grade: 4.5,
      failing_subjects_count: 5,
      severe_incidents_count: 3,
      mild_incidents_count: 6,
      consecutive_absences_max: 8,
      unjustified_absences: 18,
      grade_trend_slope: -2.0,
    },
  },
];

const LEVEL_BG_BAR: Record<string, string> = {
  rojo: "bg-red-500",
  amarillo: "bg-yellow-500",
  verde: "bg-green-500",
};

const LEVEL_LABEL: Record<string, string> = {
  rojo: "Alto",
  amarillo: "Moderado",
  verde: "Bajo",
};

function RiskScoreGauge({ score, color }: { score: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold">{Math.round(score)}</span>
        <span className="text-sm text-slate-500">/ 100</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}

function RulesResultCard({
  semaforo_riesgo,
  detalle_por_variable,
  model_version,
}: {
  semaforo_riesgo: { nivel: string; puntaje_riesgo: number; factores_criticos: string[]; recomendaciones: string[] };
  detalle_por_variable: Record<string, { nivel: string; peso: number }>;
  model_version: string;
}) {
  const { nivel, puntaje_riesgo, factores_criticos, recomendaciones } = semaforo_riesgo;
  const barColor = LEVEL_BG_BAR[nivel] ?? "bg-slate-400";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <Scale className="h-5 w-5 text-slate-600" />
        <h3 className="font-semibold text-slate-800">Score heurístico (reglas)</h3>
      </div>
      <p className="mb-4 text-xs text-slate-500">
        Ponderación de conducta, asistencia y calificaciones con pesos fijos. Detecta perfiles alarmantes aunque el estudiante apruebe.
      </p>

      <div className="mb-4 flex items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-sm font-semibold bg-slate-100 text-slate-800 border-slate-300`}>
          {LEVEL_LABEL[nivel] ?? nivel}
        </span>
      </div>

      <RiskScoreGauge score={puntaje_riesgo} color={barColor} />

      <div className="mt-4 space-y-2">
        {Object.entries(detalle_por_variable).map(([key, detalle]) => {
          const dotColor = LEVEL_BG_BAR[detalle.nivel] ?? "bg-slate-400";
          const variableLabel: Record<string, string> = {
            conducta: "Conducta",
            asistencia: "Asistencia",
            calificaciones: "Calificaciones",
          };
          return (
            <div key={key} className="flex items-center justify-between rounded bg-slate-50 px-3 py-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${dotColor}`} />
                <span className="text-slate-700">{variableLabel[key] ?? key}</span>
              </div>
              <span className="text-slate-500">{LEVEL_LABEL[detalle.nivel] ?? detalle.nivel} ({(detalle.peso * 100).toFixed(0)}%)</span>
            </div>
          );
        })}
      </div>

      {factores_criticos.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-medium uppercase text-slate-500">Factores críticos</p>
          <ul className="space-y-1">
            {factores_criticos.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recomendaciones.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium uppercase text-slate-500">Recomendaciones</p>
          <ul className="space-y-1">
            {recomendaciones.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">Modelo: {model_version}</p>
    </div>
  );
}

function MlResultCard({ puntaje_riesgo, model_version }: { puntaje_riesgo: number; model_version: string }) {
  const riskLevel = puntaje_riesgo >= 70 ? "rojo" : puntaje_riesgo >= 40 ? "amarillo" : "verde";
  const barColor = LEVEL_BG_BAR[riskLevel] ?? "bg-slate-400";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold text-slate-800">Probabilidad de reprobar (ML)</h3>
      </div>
      <p className="mb-4 text-xs text-slate-500">
        Regresión logística entrenada con 9 períodos históricos. Score = P(promedio final &lt; 7.0) × 100.
      </p>

      <RiskScoreGauge score={puntaje_riesgo} color={barColor} />

      <div className="mt-4 space-y-2">
        <div className="rounded bg-slate-50 px-3 py-2 text-sm">
          <span className="text-slate-500">Interpretación: </span>
          <span className="font-medium text-slate-700">
            {puntaje_riesgo < 20
              ? "Muy baja probabilidad de reprobar"
              : puntaje_riesgo < 40
                ? "Baja probabilidad de reprobar"
                : puntaje_riesgo < 60
                  ? "Moderada probabilidad de reprobar"
                  : puntaje_riesgo < 80
                    ? "Alta probabilidad de reprobar"
                    : "Muy alta probabilidad de reprobar"}
          </span>
        </div>
        <div className="rounded bg-slate-50 px-3 py-2 text-sm">
          <span className="text-slate-500">Basado en: </span>
          <span className="font-medium text-slate-700">510 estudiantes · 9 períodos</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">Modelo: {model_version}</p>
    </div>
  );
}

function SliderField({
  label, value, min, max, step, unit, hint, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string; hint?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range" min={min} max={max} step={step ?? 1} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
        />
        <span className="min-w-[4rem] text-right text-sm font-semibold text-slate-700">
          {value}{unit ?? ""}
        </span>
      </div>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function NumberField({
  label, value, min, hint, onChange,
}: {
  label: string; value: number; min?: number; hint?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input type="number" min={min ?? 0} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${inputClassname.input} w-full`}
      />
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default function ModelEvaluatorPage() {
  const { result, isLoading, error, evaluate } = useModelEvaluatorController();

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: simulateSchema,
    onSubmit: (values) => {
      evaluate(values);
    },
  });

  const loadScenario = (scenario: Partial<SimulateParamsT>) => {
    formik.setValues({ ...INITIAL_VALUES, ...scenario });
  };

  const mlSuccess = result?.ml && "puntaje_riesgo" in result.ml ? (result.ml as SimulateMlSuccessT) : null;
  const mlError = result?.ml && "error" in result.ml ? (result.ml as { error: string }) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Beaker className="h-8 w-8 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Simulador de Riesgo Académico</h1>
          <p className="text-sm text-slate-500">
            Compare el score heurístico (reglas) con la probabilidad real de reprobar estimada por el modelo ML
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ─── Left panel: Inputs ─── */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-700">
            <Scale className="h-5 w-5" />
            Parámetros
          </h2>

          <div className="mb-5">
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">Escenarios de prueba rápida</p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {SCENARIOS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.label} type="button"
                    onClick={() => loadScenario(s.values)}
                    className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-left text-xs transition-colors ${s.color}`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-slate-500" />
                    <div>
                      <span className="block font-medium text-slate-700">{s.label}</span>
                      <span className="block text-slate-400">{s.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <fieldset className="space-y-3 rounded-lg border border-slate-100 p-4">
              <legend className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                <GraduationCap className="h-4 w-4" />
                Asistencia
              </legend>
              <SliderField
                label="Porcentaje de asistencia" hint="Clases asistidas / clases totales × 100"
                value={formik.values.attendance_rate} min={0} max={100} unit="%"
                onChange={(v) => formik.setFieldValue("attendance_rate", v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Faltas consecutivas máximas" hint="Mayor racha de inasistencias seguidas"
                  value={formik.values.consecutive_absences_max!}
                  onChange={(v) => formik.setFieldValue("consecutive_absences_max", v)} />
                <NumberField label="Atrasos acumulados" hint="Llegadas tarde al periodo"
                  value={formik.values.tardiness_count!}
                  onChange={(v) => formik.setFieldValue("tardiness_count", v)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Faltas justificadas" hint="Con justificación"
                  value={formik.values.justified_absences!}
                  onChange={(v) => formik.setFieldValue("justified_absences", v)} />
                <NumberField label="Faltas injustificadas" hint="Sin justificación"
                  value={formik.values.unjustified_absences!}
                  onChange={(v) => formik.setFieldValue("unjustified_absences", v)} />
              </div>
            </fieldset>

            <fieldset className="space-y-3 rounded-lg border border-slate-100 p-4">
              <legend className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                <BookOpen className="h-4 w-4" />
                Calificaciones
              </legend>
              <SliderField
                label="Promedio general (0–10)" hint="Media ponderada de todas las notas del período"
                value={formik.values.average_grade} min={0} max={10} step={0.1}
                onChange={(v) => formik.setFieldValue("average_grade", v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Materias reprobadas" hint="Con promedio inferior a 7"
                  value={formik.values.failing_subjects_count}
                  onChange={(v) => formik.setFieldValue("failing_subjects_count", v)} />
                <NumberField label="Tendencia de notas" hint="Negativo = nota bajando"
                  value={formik.values.grade_trend_slope!} min={-10}
                  onChange={(v) => formik.setFieldValue("grade_trend_slope", v)} />
              </div>
            </fieldset>

            <fieldset className="space-y-3 rounded-lg border border-slate-100 p-4">
              <legend className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                <AlertTriangle className="h-4 w-4" />
                Conducta
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Faltas graves" hint="Agresiones, daños graves"
                  value={formik.values.severe_incidents_count}
                  onChange={(v) => formik.setFieldValue("severe_incidents_count", v)} />
                <NumberField label="Faltas leves" hint="Impuntualidad, desorden"
                  value={formik.values.mild_incidents_count}
                  onChange={(v) => formik.setFieldValue("mild_incidents_count", v)} />
              </div>
            </fieldset>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <button type="submit" disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Evaluando...</>
              ) : (
                <><FlaskConical className="h-4 w-4" /> Evaluar</>
              )}
            </button>
          </form>
        </div>

        {/* ─── Right panel: Results ─── */}
        <div className="space-y-6 lg:col-span-3">
          {!result && !isLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
              <div className="text-center text-slate-400">
                <FlaskConical className="mx-auto mb-2 h-12 w-12" />
                <p className="text-sm">Ajuste los parámetros y presione <strong>Evaluar</strong></p>
                <p className="text-xs text-slate-400">o seleccione un escenario predefinido</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                <p className="mt-2 text-sm text-slate-500">Evaluando parámetros...</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {result.config_usada && (
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-600">
                    <span>Motor activo: <strong className="text-slate-800">{result.config_usada.engine === "reglas" ? "Reglas" : "ML"}</strong></span>
                    <span>Preset: <strong className="text-slate-800">{result.config_usada.preset}</strong></span>
                    <span>Pesos: C{result.config_usada.weight_conducta}% / A{result.config_usada.weight_asistencia}% / G{result.config_usada.weight_calificaciones}%</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <RulesResultCard
                  semaforo_riesgo={result.reglas.semaforo_riesgo}
                  detalle_por_variable={result.reglas.detalle_por_variable}
                  model_version={result.reglas.model_version}
                />

                {mlSuccess && (
                  <MlResultCard puntaje_riesgo={mlSuccess.puntaje_riesgo} model_version={mlSuccess.model_version} />
                )}

                {mlError && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    <strong>ML no disponible:</strong> {mlError.error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
