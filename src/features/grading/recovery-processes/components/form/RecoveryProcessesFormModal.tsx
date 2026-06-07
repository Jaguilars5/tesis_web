import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput, CustomSelect, CustomTextArea } from "@shared/components/Form";

import { recoveryProcessSchema } from "../../presentation/utils/recovery-processes.validation";

import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";
import type { RecoveryProcessFormValues } from "../../presentation/hooks/useRecoveryProcessesForm";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";

interface RecoveryProcessesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingRecoveryProcess: RecoveryProcessT | null;
  onSubmit: (values: RecoveryProcessFormValues) => Promise<void>;
  periodGradeSummaryOptions: SelectOptionT[];
  managedByUserOptions: SelectOptionT[];
  processTypeOptions: SelectOptionT[];
}

export const RecoveryProcessesFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingRecoveryProcess,
  onSubmit,
  periodGradeSummaryOptions,
  managedByUserOptions,
  processTypeOptions,
}: RecoveryProcessesFormModalProps) => {
  const getInitialValues = (): RecoveryProcessFormValues => {
    if (editingRecoveryProcess) {
      return {
        initial_grade: editingRecoveryProcess.initial_grade,
        reinforcement_grade: editingRecoveryProcess.reinforcement_grade ?? null,
        improvement_eval_grade: editingRecoveryProcess.improvement_eval_grade ?? null,
        final_calculated_grade: editingRecoveryProcess.final_calculated_grade ?? null,
        family_notified: editingRecoveryProcess.family_notified,
        start_date: editingRecoveryProcess.start_date,
        end_date: editingRecoveryProcess.end_date ?? null,
        observations: editingRecoveryProcess.observations ?? "",
        period_grade_summary: editingRecoveryProcess.period_grade_summary,
        managed_by_user: editingRecoveryProcess.managed_by_user,
        process_type: editingRecoveryProcess.process_type ?? null,
      };
    }
    return {
      initial_grade: 0,
      reinforcement_grade: null,
      improvement_eval_grade: null,
      final_calculated_grade: null,
      family_notified: false,
      start_date: "",
      end_date: null,
      observations: "",
      period_grade_summary: 0,
      managed_by_user: 0,
      process_type: null,
    };
  };

  const formik = useFormik<RecoveryProcessFormValues>({
    initialValues: getInitialValues(),
    validationSchema: recoveryProcessSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingRecoveryProcess) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingRecoveryProcess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Proceso de Recuperación" : "Nuevo Proceso de Recuperación"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Gestione el proceso de recuperación académica
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CustomSelect
              label="Resumen de Calificaciones"
              name="period_grade_summary"
              options={periodGradeSummaryOptions}
              value={formik.values.period_grade_summary}
              onChange={(opt) => formik.setFieldValue("period_grade_summary", opt.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.period_grade_summary ? formik.errors.period_grade_summary : undefined}
              className={selectClassname}
              placeholder="Seleccione un resumen"
            />

            <CustomSelect
              label="Usuario Gestor"
              name="managed_by_user"
              options={managedByUserOptions}
              value={formik.values.managed_by_user}
              onChange={(opt) => formik.setFieldValue("managed_by_user", opt.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.managed_by_user ? formik.errors.managed_by_user : undefined}
              className={selectClassname}
              placeholder="Seleccione un usuario"
            />

            <CustomSelect
              label="Tipo de Proceso"
              name="process_type"
              options={processTypeOptions}
              value={formik.values.process_type ?? ""}
              onChange={(opt) => formik.setFieldValue("process_type", opt.value || null)}
              onBlur={formik.handleBlur}
              error={formik.touched.process_type ? formik.errors.process_type : undefined}
              className={selectClassname}
              placeholder="Seleccione un tipo"
            />

            <CustomInput
              label="Nota Inicial"
              name="initial_grade"
              placeholder="0 - 10"
              value={formik.values.initial_grade}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="number"
              error={formik.touched.initial_grade ? formik.errors.initial_grade : undefined}
              className={inputClassname}
            />

            <CustomInput
              label="Nota de Refuerzo"
              name="reinforcement_grade"
              placeholder="0 - 10"
              value={formik.values.reinforcement_grade ?? ""}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="number"
              error={formik.touched.reinforcement_grade ? formik.errors.reinforcement_grade : undefined}
              className={inputClassname}
            />

            <CustomInput
              label="Nota Evaluación de Mejora"
              name="improvement_eval_grade"
              placeholder="0 - 10"
              value={formik.values.improvement_eval_grade ?? ""}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="number"
              error={formik.touched.improvement_eval_grade ? formik.errors.improvement_eval_grade : undefined}
              className={inputClassname}
            />

            <CustomInput
              label="Nota Final Calculada"
              name="final_calculated_grade"
              placeholder="0 - 10"
              value={formik.values.final_calculated_grade ?? ""}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="number"
              error={formik.touched.final_calculated_grade ? formik.errors.final_calculated_grade : undefined}
              className={inputClassname}
            />

            <CustomInput
              label="Fecha de Inicio"
              name="start_date"
              type="date"
              value={formik.values.start_date}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.start_date ? formik.errors.start_date : undefined}
              className={inputClassname}
            />

            <CustomInput
              label="Fecha de Fin"
              name="end_date"
              type="date"
              value={formik.values.end_date ?? ""}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.end_date ? formik.errors.end_date : undefined}
              className={inputClassname}
            />
          </div>

          <CustomTextArea
            label="Observaciones"
            name="observations"
            placeholder="Observaciones opcionales..."
            value={formik.values.observations ?? ""}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.observations ? formik.errors.observations : undefined}
            rows={3}
          />

          <CustomCheckbox
            name="family_notified"
            checked={formik.values.family_notified}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Notificado a la familia"
            className={checkboxClassname}
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
