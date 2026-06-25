import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import { DAY_OF_WEEK_OPTIONS } from "../class-schedule.constants";
import { classScheduleSchema } from "../class-schedule.utils";
import type {
  ClassScheduleFormValues,
  ClassScheduleT,
} from "../class-schedule.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    teacher_subject_section: "Asignación docente-materia",
    day_of_week: "Día de la semana",
    start_time: "Hora de inicio",
    end_time: "Hora de fin",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface ClassScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingClassSchedule: ClassScheduleT | null;
  teacherSubjectSectionOptions: { label: string; value: string }[];
  submitErrors: SubmitErrorState;
  onSubmit: (values: ClassScheduleFormValues) => Promise<void>;
}

const getInitialValues = (
  editingClassSchedule: ClassScheduleT | null,
): ClassScheduleFormValues => {
  if (editingClassSchedule) {
    return {
      teacher_subject_section: editingClassSchedule.teacher_subject_section,
      day_of_week: editingClassSchedule.day_of_week,
      start_time: editingClassSchedule.start_time,
      end_time: editingClassSchedule.end_time,
    };
  }
  return {
    teacher_subject_section: 0,
    day_of_week: 1,
    start_time: "",
    end_time: "",
  };
};

export const ClassScheduleFormModal: React.FC<ClassScheduleFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingClassSchedule,
  teacherSubjectSectionOptions,
  submitErrors,
  onSubmit,
}) => {
  const formik = useFormik<ClassScheduleFormValues>({
    initialValues: getInitialValues(editingClassSchedule),
    validationSchema: classScheduleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  useEffect(() => {
    if (isOpen) {
      formik.setValues(getInitialValues(editingClassSchedule));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingClassSchedule]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Horario" : "Nuevo Horario"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el horario de clases
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

        {(submitErrors.general.length > 0 ||
          Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomSelect
            label="Asignación Docente-Materia"
            name="teacher_subject_section"
            value={String(formik.values.teacher_subject_section)}
            onChange={(option) =>
              formik.setFieldValue(
                "teacher_subject_section",
                Number(option.value),
              )
            }
            options={teacherSubjectSectionOptions}
            className={selectClassname}
            error={
              submitErrors.validation.teacher_subject_section ??
              (formik.touched.teacher_subject_section
                ? formik.errors.teacher_subject_section
                : undefined)
            }
          />

          <CustomSelect
            label="Día de la Semana"
            name="day_of_week"
            value={String(formik.values.day_of_week)}
            onChange={(option) =>
              formik.setFieldValue("day_of_week", Number(option.value))
            }
            options={
              DAY_OF_WEEK_OPTIONS as unknown as {
                label: string;
                value: string;
              }[]
            }
            className={selectClassname}
            error={
              submitErrors.validation.day_of_week ??
              (formik.touched.day_of_week
                ? formik.errors.day_of_week
                : undefined)
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Hora de Inicio"
              name="start_time"
              type="time"
              value={formik.values.start_time}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={inputClassname}
              error={
                submitErrors.validation.start_time ??
                (formik.touched.start_time
                  ? formik.errors.start_time
                  : undefined)
              }
            />

            <CustomInput
              label="Hora de Fin"
              name="end_time"
              type="time"
              value={formik.values.end_time}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={inputClassname}
              error={
                submitErrors.validation.end_time ??
                (formik.touched.end_time ? formik.errors.end_time : undefined)
              }
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
