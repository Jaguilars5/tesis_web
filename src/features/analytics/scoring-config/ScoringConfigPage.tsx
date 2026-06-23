import { useFormik } from "formik";
import {
  AlertTriangle,
  Cpu,
  RotateCcw,
  Save,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo } from "react";

import { CustomInput } from "@shared/components/Form/CustomInput/CustomInput";
import { toast } from "@shared/components/Toast";
import { inputClassname } from "@app/styles/styles";

import {
  ENGINE_OPTIONS,
  PRESET_OPTIONS,
  WEIGHT_SUM,
} from "./scoring-config.constants";
import { useScoringConfigController } from "./scoring-config.controller";
import type {
  ScoringConfigFormValues,
  ScoringPresetT,
} from "./scoring-config.types";
import {
  scoringConfigSchema,
  toFormValues,
  weightSum,
} from "./scoring-config.utils";

const EMPTY_VALUES: ScoringConfigFormValues = {
  engine: "reglas",
  weight_conducta: 30,
  weight_asistencia: 35,
  weight_calificaciones: 35,
  attendance_red_max: 70,
  attendance_yellow_max: 85,
  average_red_max: 6,
  average_yellow_max: 7,
  severe_red_min: 3,
  mild_yellow_min: 5,
};

const PRESET_LABELS: Record<string, string> = {
  conservador: "Conservador",
  equilibrado: "Equilibrado",
  estricto: "Estricto",
  personalizado: "Personalizado",
};

export default function ScoringConfigPage() {
  const { config, isLoading, error, loadConfig, save, applyPreset, resetError } =
    useScoringConfigController();

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const formik = useFormik<ScoringConfigFormValues>({
    initialValues: config ? toFormValues(config) : EMPTY_VALUES,
    validationSchema: scoringConfigSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await save({ ...values, preset: "personalizado" });
        toast("Configuración guardada correctamente.", "success");
      } catch {
        toast("No se pudo guardar la configuración.", "error");
      }
    },
  });

  const total = useMemo(
    () =>
      weightSum({
        weight_conducta: Number(formik.values.weight_conducta),
        weight_asistencia: Number(formik.values.weight_asistencia),
        weight_calificaciones: Number(formik.values.weight_calificaciones),
      }),
    [
      formik.values.weight_conducta,
      formik.values.weight_asistencia,
      formik.values.weight_calificaciones,
    ],
  );

  const sumOk = Math.abs(total - WEIGHT_SUM) <= 0.01;

  const handleApplyPreset = async (preset: ScoringPresetT) => {
    try {
      await applyPreset(preset);
      toast(`Preset "${PRESET_LABELS[preset]}" aplicado.`, "success");
    } catch {
      toast("No se pudo aplicar el preset.", "error");
    }
  };

  const fieldError = (name: keyof ScoringConfigFormValues): string | undefined =>
    formik.touched[name] && formik.errors[name]
      ? (formik.errors[name] as string)
      : undefined;

  if (isLoading && !config) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-72 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Settings2 className="size-7 text-primary" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Motor de Riesgo Académico
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Configura pesos, umbrales y el motor de cálculo del riesgo
            </p>
          </div>
        </div>
        {config && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Preset actual: {PRESET_LABELS[config.preset] ?? config.preset}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => {
              resetError();
              loadConfig();
            }}
            className="flex items-center gap-1 rounded-md border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
          >
            <RotateCcw className="size-3" />
            Reintentar
          </button>
        </div>
      )}

      {/* Presets rápidos */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Presets seguros
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {PRESET_OPTIONS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleApplyPreset(preset.value)}
              className={`flex flex-col rounded-lg border p-3 text-left transition hover:border-primary hover:bg-primary/5 ${
                config?.preset === preset.value
                  ? "border-primary bg-primary/5"
                  : "border-slate-200"
              }`}
            >
              <span className="text-sm font-bold text-slate-800">
                {preset.label}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Motor de cálculo */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Cpu className="size-5 text-slate-500" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Motor de cálculo
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {ENGINE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                  formik.values.engine === option.value
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="engine"
                  value={option.value}
                  checked={formik.values.engine === option.value}
                  onChange={() => formik.setFieldValue("engine", option.value)}
                  className="mt-0.5 size-4 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-slate-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Si el modelo de ML no está disponible, el sistema usa el motor de
            reglas como respaldo.
          </p>
        </section>

        {/* Pesos */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-slate-500" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Pesos de los factores
              </h2>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                sumOk
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Total: {total}% / {WEIGHT_SUM}%
            </span>
          </div>

          <div className="space-y-5">
            {(
              [
                ["weight_conducta", "Conducta"],
                ["weight_asistencia", "Asistencia"],
                ["weight_calificaciones", "Calificaciones"],
              ] as const
            ).map(([field, label]) => (
              <div key={field}>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    {label}
                  </label>
                  <span className="text-sm font-semibold text-slate-800">
                    {Number(formik.values[field])}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Number(formik.values[field])}
                  onChange={(e) =>
                    formik.setFieldValue(field, Number(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary"
                />
                {fieldError(field) && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldError(field)}
                  </p>
                )}
              </div>
            ))}
          </div>
          {!sumOk && (
            <p className="mt-3 text-xs text-red-500">
              Los pesos deben sumar exactamente {WEIGHT_SUM}%.
            </p>
          )}
        </section>

        {/* Umbrales */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            Umbrales (semáforo)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <CustomInput
              type="number"
              name="attendance_red_max"
              label="Asistencia — máximo ROJO (%)"
              value={formik.values.attendance_red_max}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("attendance_red_max")}
              className={inputClassname}
              min={0}
              max={100}
              step={0.01}
            />
            <CustomInput
              type="number"
              name="attendance_yellow_max"
              label="Asistencia — máximo AMARILLO (%)"
              value={formik.values.attendance_yellow_max}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("attendance_yellow_max")}
              className={inputClassname}
              min={0}
              max={100}
              step={0.01}
            />
            <CustomInput
              type="number"
              name="average_red_max"
              label="Promedio — máximo ROJO (0-10)"
              value={formik.values.average_red_max}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("average_red_max")}
              className={inputClassname}
              min={0}
              max={10}
              step={0.01}
            />
            <CustomInput
              type="number"
              name="average_yellow_max"
              label="Promedio — máximo AMARILLO (0-10)"
              value={formik.values.average_yellow_max}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("average_yellow_max")}
              className={inputClassname}
              min={0}
              max={10}
              step={0.01}
            />
            <CustomInput
              type="number"
              name="severe_red_min"
              label="Incidentes graves — mínimo ROJO"
              value={formik.values.severe_red_min}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("severe_red_min")}
              className={inputClassname}
              min={1}
              step={1}
            />
            <CustomInput
              type="number"
              name="mild_yellow_min"
              label="Incidentes leves — mínimo AMARILLO"
              value={formik.values.mild_yellow_min}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("mild_yellow_min")}
              className={inputClassname}
              min={1}
              step={1}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => formik.resetForm()}
            disabled={formik.isSubmitting || !formik.dirty}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="size-4" />
            Descartar
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting || !sumOk}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="size-4" />
            {formik.isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
