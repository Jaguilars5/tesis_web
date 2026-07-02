import { AlertTriangle, BarChart3, RefreshCcw, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAcademicPeriodController } from "@features/academic/academic-period";
import { toast } from "@shared/components/Toast";
import { useAppDispatch } from "@shared/redux/hooks";
import { addCompletedTaskId } from "./risk-score.slice";

import { RiskScoreTable } from "./components/RiskScoreTable";
import { useRiskScoreController } from "./analytics.controller";

const SOCKET_FALLBACK_TIMEOUT_MS = 30_000;

export default function RiskScoreListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { academicPeriods, loadAcademicPeriods } = useAcademicPeriodController();
  const {
    scores,
    totalCount,
    calcStatus,
    calcTaskId,
    error,
    loadScores,
    recalculate,
    resetCalc,
    isLoading,
  } = useRiskScoreController();

  const [showConfirm, setShowConfirm] = useState(false);
  const notifiedRef = useRef(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePeriod = useMemo(() => {
    if (academicPeriods.length === 0) return null;
    return (
      academicPeriods.find((p) => p.is_active) ?? academicPeriods[0] ?? null
    );
  }, [academicPeriods]);

  const activePeriodId = activePeriod?.id ?? null;

  useEffect(() => {
    loadAcademicPeriods({ page: 1, pageSize: 100 });
  }, [loadAcademicPeriods]);

  useEffect(() => {
    if (activePeriodId !== null) {
      loadScores({ academic_period: activePeriodId, page: 1, pageSize: 10 });
    }
  }, [activePeriodId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (calcStatus === "done" && !notifiedRef.current) {
      notifiedRef.current = true;
      toast("Cálculo completado. Los puntajes se han actualizado.", "success");
      resetCalc();
      if (activePeriodId !== null) {
        loadScores({ academic_period: activePeriodId, page: 1, pageSize: 10 });
      }
    }
  }, [calcStatus, activePeriodId, loadScores, resetCalc]);

  useEffect(() => {
    if (calcStatus === "failed" && !notifiedRef.current) {
      notifiedRef.current = true;
      toast("Error al recalcular. Intenta de nuevo.", "error");
      const timer = setTimeout(() => resetCalc(), 2000);
      return () => clearTimeout(timer);
    }
  }, [calcStatus, resetCalc]);

  useEffect(() => {
    if (calcStatus === "idle") {
      notifiedRef.current = false;
    }
  }, [calcStatus]);

  useEffect(() => {
    if (calcStatus === "running" && calcTaskId) {
      fallbackTimerRef.current = setTimeout(() => {
        dispatch(addCompletedTaskId(calcTaskId));
      }, SOCKET_FALLBACK_TIMEOUT_MS);
    } else {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    }
    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [calcStatus, calcTaskId, dispatch]);

  const handleViewDetail = useCallback(
    (id: number) => navigate(`/analytics/risk-scores/${id}`),
    [navigate],
  );

  const handleRecalculate = useCallback(() => {
    if (!activePeriodId) return;
    notifiedRef.current = false;
    recalculate({ academic_period_id: activePeriodId });
    setShowConfirm(false);
  }, [activePeriodId, recalculate]);

  const retryLoad = useCallback(() => {
    if (activePeriodId !== null) {
      loadScores({ academic_period: activePeriodId, page: 1, pageSize: 10 });
    }
  }, [activePeriodId, loadScores]);

  if (!activePeriod) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800">Riesgo Académico</h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-16">
          <BarChart3 className="mb-4 size-12 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-600">Sin período activo</h3>
          <p className="mt-1 text-sm text-slate-500">
            No hay un período académico activo. Activa un período para ver los puntajes de riesgo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Riesgo Académico
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {activePeriod.name} — Puntaje = probabilidad estimada de reprobar
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={retryLoad}
            className="flex items-center gap-1 rounded-md border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
          >
            <RotateCcw className="size-3" />
            Reintentar
          </button>
        </div>
      )}

      {calcStatus === "running" && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <RefreshCcw className="size-4 animate-spin shrink-0" />
          <span>Cálculo de riesgo en segundo plano. Los resultados se actualizarán automáticamente...</span>
        </div>
      )}

      <RiskScoreTable
        scores={scores}
        totalCount={totalCount}
        isLoading={isLoading}
        loadScores={loadScores}
        academicPeriodId={activePeriodId ?? undefined}
        onViewDetail={handleViewDetail}
        onRecalculate={() => setShowConfirm(true)}
        isCalculating={calcStatus === "running"}
      />

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">
              Recalcular riesgos
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              ¿Estás seguro de recalcular los puntajes de riesgo para
              <strong> {activePeriod.name}</strong>?
              Esta operación puede tomar unos segundos dependiendo de la cantidad de estudiantes.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRecalculate}
                disabled={calcStatus === "running"}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {calcStatus === "running" ? "Calculando..." : "Recalcular"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
