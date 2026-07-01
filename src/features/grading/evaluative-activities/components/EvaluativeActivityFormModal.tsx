import { useFormik } from "formik";
import { X } from "lucide-react";

import { getTodayLocal } from "@features/academic/academic-period/academic-period.utils";
import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import { useBlockComponentOptions } from "@features/grading/block-components/hooks/useBlockComponentOptions";

import { evaluativeActivitySchema } from "../evaluative-activities.utils";

import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type {
  EvaluativeActivityFormValues,
  EvaluativeActivityT,
} from "../evaluative-activities.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    title: "Título",
    teacher_subject_section: "Docente-Materia",
    activity_type: "Tipo",
    max_score: "Punt. Máx.",
    due_date: "Vencimiento",
    block_component: "Bloque",
    internal_weight: "Ponderación",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface EvaluativeActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingEvaluativeActivity: EvaluativeActivityT | null;
  teacherSubjectSectionOptions: { label: string; value: string }[];
  activityTypeOptions: { label: string; value: string }[];
  onSubmit: (values: EvaluativeActivityFormValues) => Promise<void>;
  submitErrors?: SubmitErrorState;
}

export const EvaluativeActivityFormModal: React.FC<
  EvaluativeActivityFormModalProps
> = ({
  isOpen,
  onClose,
  isEdit,
  editingEvaluativeActivity,
  teacherSubjectSectionOptions,
  activityTypeOptions,
  onSubmit,
  submitErrors = { general: [], validation: {} },
}) => {
  const getInitialValues = (): EvaluativeActivityFormValues => {
    if (editingEvaluativeActivity) {
      return {
        title: editingEvaluativeActivity.title ?? "",
        teacher_subject_section:
          editingEvaluativeActivity.teacher_subject_section ?? 0,
        activity_type: editingEvaluativeActivity.activity_type ?? null,
        max_score: editingEvaluativeActivity.max_score ?? "10",
        due_date: editingEvaluativeActivity.due_date ?? "",
        block_component: editingEvaluativeActivity.block_component ?? 0,
        internal_weight: editingEvaluativeActivity.internal_weight ?? "0",
      };
    }
    return {
      title: "",
      teacher_subject_section: 0,
      activity_type: null,
      max_score: "10",
      due_date: "",
      block_component: 0,
      internal_weight: "0",
    };
  };

  const formik = useFormik<EvaluativeActivityFormValues>({
    initialValues: getInitialValues(),
    validationSchema: evaluativeActivitySchema,
    onSubmit,
  });

  const selectedTssId = formik.values.teacher_subject_section || null;
  const referenceDate = formik.values.due_date || getTodayLocal();
  const {
    blockComponentOptions,
    blockComponentsLoading,
    blockComponentsError,
    academicPeriodName,
  } = useBlockComponentOptions(
    !isEdit ? selectedTssId : null,
    !isEdit ? referenceDate : null,
  );

  const canLoadBlocks = Boolean(selectedTssId);

  const resetBlockSelection = () => {
    formik.setFieldValue("block_component", 0);
    formik.setFieldValue("internal_weight", "0");
  };

  const handleTeacherSubjectSectionChange = (option: {
    value: string | number;
  }) => {
    formik.setFieldValue("teacher_subject_section", Number(option.value));
    resetBlockSelection();
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    resetBlockSelection();
  };

  const handleBlockComponentChange = (option: { value: string | number }) => {
    const v = String(option.value);
    const sel = blockComponentOptions.find((bc) => bc.value === v);
    formik.setFieldValue("block_component", Number(v));
    if (sel) formik.setFieldValue("internal_weight", sel.internalWeight);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar" : "Nueva"} Actividad
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure la actividad evaluativa
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {(submitErrors.general.length > 0 ||
          Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput
            label="Título"
            name="title"
            value={formik.values.title}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.title ? formik.errors.title : undefined}
            className={inputClassname}
          />
          <CustomSelect
            label="Asignatura"
            placeholder="Seleccionar Asignatura..."
            name="teacher_subject_section"
            value={String(formik.values.teacher_subject_section)}
            onChange={handleTeacherSubjectSectionChange}
            options={teacherSubjectSectionOptions}
            className={selectClassname}
            error={
              formik.touched.teacher_subject_section
                ? formik.errors.teacher_subject_section
                : undefined
            }
          />
          {!isEdit && (
            <div>
              <CustomSelect
                label="Bloque / Componente"
                name="block_component"
                value={String(formik.values.block_component || "")}
                onChange={handleBlockComponentChange}
                options={blockComponentOptions}
                className={selectClassname}
                error={
                  formik.touched.block_component
                    ? formik.errors.block_component
                    : undefined
                }
              />
              {!canLoadBlocks && (
                <p className="mt-1 text-xs text-slate-400">
                  Seleccione Docente-Materia para ver los bloques disponibles.
                </p>
              )}
              {canLoadBlocks && academicPeriodName && (
                <p className="mt-1 text-xs text-slate-500">
                  Período: <strong>{academicPeriodName}</strong>
                  {!formik.values.due_date && " (fecha actual)"}
                </p>
              )}
              {canLoadBlocks && blockComponentsLoading && (
                <p className="mt-1 text-xs text-slate-400">
                  Cargando bloques...
                </p>
              )}
              {!blockComponentsLoading && blockComponentsError && (
                <p className="mt-1 text-xs text-red-600">
                  {blockComponentsError}
                </p>
              )}
              {canLoadBlocks &&
                !blockComponentsLoading &&
                !blockComponentsError &&
                blockComponentOptions.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No hay bloques configurados para este período.
                  </p>
                )}
              {formik.values.internal_weight &&
                Number(formik.values.internal_weight) > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    Ponderación:{" "}
                    <strong>{formik.values.internal_weight}%</strong>
                  </p>
                )}
            </div>
          )}
          <CustomSelect
            label="Tipo de Actividad"
            name="activity_type"
            value={String(formik.values.activity_type ?? "")}
            onChange={(o) =>
              formik.setFieldValue(
                "activity_type",
                o.value ? Number(o.value) : null,
              )
            }
            options={activityTypeOptions}
            className={selectClassname}
            error={
              formik.touched.activity_type
                ? formik.errors.activity_type
                : undefined
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Punt. Máx."
              name="max_score"
              type="number"
              value={formik.values.max_score}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.max_score ? formik.errors.max_score : undefined
              }
              className={inputClassname}
            />
            <CustomInput
              label="Vencimiento"
              name="due_date"
              type="date"
              value={formik.values.due_date}
              onBlur={formik.handleBlur}
              onChange={handleDueDateChange}
              error={
                formik.touched.due_date ? formik.errors.due_date : undefined
              }
              className={inputClassname}
            />
          </div>

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
              disabled={formik.isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </>
              ) : isEdit ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
