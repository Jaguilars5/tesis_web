import { Calculator, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectClassname } from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form";
import { useEnrollmentOptions, useAcademicPeriodOptions } from "../conduct-incident/conduct-incident.options";
import { useBehaviorEvaluationController, useBehaviorEvaluationForm } from "./behavior-evaluation.controller";
import { BehaviorEvaluationFormModal } from "./components/BehaviorEvaluationFormModal";
import { BehaviorEvaluationTable } from "./components/BehaviorEvaluationTable";
import { BehaviorEvaluationViewModal } from "./components/BehaviorEvaluationViewModal";
import type { BehaviorEvaluationT } from "./behavior-evaluation.types";

export default function BehaviorEvaluationPage() {
  const { behaviorEvaluations, isLoading, loadBehaviorEvaluations, calculateBehaviorEvaluation, updateBehaviorEvaluation } = useBehaviorEvaluationController();
  const { isOpen, editingEvaluation, submitErrors, openModal, closeModal, handleSubmit } = useBehaviorEvaluationForm({ update: updateBehaviorEvaluation });
  const { enrollmentOptions } = useEnrollmentOptions();
  const { academicPeriodOptions } = useAcademicPeriodOptions();

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCalculateOpen, setIsCalculateOpen] = useState(false);
  const [calculateEnrollmentId, setCalculateEnrollmentId] = useState<number | null>(null);
  const [calculatePeriodId, setCalculatePeriodId] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const openViewModal = useCallback((evaluation: BehaviorEvaluationT) => { setViewingId(evaluation.id); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setIsViewOpen(false); setViewingId(null); }, []);
  const openCalculateModal = useCallback(() => { setIsCalculateOpen(true); }, []);
  const closeCalculateModal = useCallback(() => { setIsCalculateOpen(false); setCalculateEnrollmentId(null); setCalculatePeriodId(null); }, []);

  const handleCalculate = useCallback(async () => {
    if (!calculateEnrollmentId || !calculatePeriodId) return;
    setIsCalculating(true);
    await calculateBehaviorEvaluation({ enrollment_id: calculateEnrollmentId, academic_period_id: calculatePeriodId });
    setIsCalculating(false);
    closeCalculateModal();
  }, [calculateEnrollmentId, calculatePeriodId, calculateBehaviorEvaluation, closeCalculateModal]);

  const handleOverride = useCallback((evaluation: BehaviorEvaluationT) => { openModal(evaluation); }, [openModal]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-extrabold text-slate-800">Evaluaciones de Conducta</h1><p className="mt-1 text-sm text-slate-500">Gestión de evaluaciones conductuales de estudiantes</p></div>
        <button type="button" onClick={openCalculateModal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"><Calculator className="size-4" />Calcular Evaluación</button>
      </div>

      <BehaviorEvaluationTable behaviorEvaluations={behaviorEvaluations} isLoading={isLoading} loadBehaviorEvaluations={loadBehaviorEvaluations} onEdit={handleOverride} onView={openViewModal} />

      {isCalculateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeCalculateModal} />
          <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div><h3 className="text-lg font-semibold text-slate-900">Calcular Evaluación</h3><p className="mt-0.5 text-sm text-slate-500">Seleccione la matrícula y período para calcular</p></div>
              <button type="button" onClick={closeCalculateModal} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><Plus className="size-5 rotate-45" /></button>
            </div>
            <div className="space-y-4 p-5">
              <CustomSelect label="Matrícula" name="enrollment_id" value={calculateEnrollmentId ?? ""} onChange={(option) => setCalculateEnrollmentId(option.value ? Number(option.value) : null)} options={enrollmentOptions} className={selectClassname} />
              <CustomSelect label="Período Académico" name="academic_period_id" value={calculatePeriodId ?? ""} onChange={(option) => setCalculatePeriodId(option.value ? Number(option.value) : null)} options={academicPeriodOptions} className={selectClassname} />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button type="button" onClick={closeCalculateModal} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">Cancelar</button>
              <button type="button" onClick={handleCalculate} disabled={isCalculating || !calculateEnrollmentId || !calculatePeriodId} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
                {isCalculating ? <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Calculando...</> : "Calcular"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BehaviorEvaluationFormModal isOpen={isOpen} onClose={closeModal} editingEvaluation={editingEvaluation} onSubmit={handleSubmit} submitErrors={submitErrors} />
      <BehaviorEvaluationViewModal isOpen={isViewOpen} evaluationId={viewingId} onClose={closeViewModal} onEdit={handleOverride} />
    </div>
  );
}
