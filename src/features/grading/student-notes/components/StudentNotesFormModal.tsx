import { useFormik } from "formik";
import { X } from "lucide-react";
import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { studentNoteSchema } from "../student-notes.utils";
import type {
  StudentNoteFormValues,
  StudentNoteT,
} from "../student-notes.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingItem: StudentNoteT | null;
  onSubmit: (values: StudentNoteFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
  enrollmentOptions: { label: string; value: string }[];
  evaluativeActivityOptions: { label: string; value: string }[];
  gradeTypeOptions: { label: string; value: string }[];
  qualitativeScaleOptions: { label: string; value: string }[];
}

const getFieldLabel = (field: string): string =>
  ({
    enrollment: "Matrícula",
    evaluative_activity: "Actividad",
    grading_mode: "Tipo",
    numeric_score: "Puntaje",
    qualitative_scale: "Escala",
    teacher_observation: "Observación",
    non_field_errors: "Error general",
  })[field] || field;

const getInitialValues = (
  editing?: StudentNoteT | null,
): StudentNoteFormValues => {
  if (editing)
    return {
      enrollment: editing.enrollment ?? "",
      evaluative_activity: editing.evaluative_activity ?? "",
      grading_mode: editing.grading_mode,
      numeric_score: editing.numeric_score ?? null,
      qualitative_scale: editing.qualitative_scale ?? "",
      teacher_observation: editing.teacher_observation ?? "",
    };
  return {
    enrollment: "",
    evaluative_activity: "",
    grading_mode: "",
    numeric_score: null,
    qualitative_scale: "",
    teacher_observation: "",
  };
};

export const StudentNotesFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isEdit,
  editingItem,
  onSubmit,
  submitErrors,
  enrollmentOptions,
  evaluativeActivityOptions,
  gradeTypeOptions,
  qualitativeScaleOptions,
}) => {
  const formik = useFormik<StudentNoteFormValues>({
    initialValues: getInitialValues(editingItem),
    validationSchema: studentNoteSchema,
    onSubmit,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar" : "Nueva"} Nota
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit
                ? "Modifique los datos de la nota"
                : "Registre una nueva nota académica"}
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

        <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          {isEdit && editingItem && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <p>
                <strong>Matrícula:</strong> {editingItem.enrollment_name}
              </p>
              <p>
                <strong>Actividad:</strong>{" "}
                {editingItem.evaluative_activity_title}
              </p>
            </div>
          )}

          {!isEdit && (
            <>
              <CustomSelect
                label="Matrícula"
                name="enrollment"
                options={enrollmentOptions}
                value={formik.values.enrollment}
                onChange={(option) =>
                  formik.setFieldValue("enrollment", option.value)
                }
                onBlur={formik.handleBlur}
                error={
                  formik.touched.enrollment
                    ? formik.errors.enrollment
                    : undefined
                }
                className={selectClassname}
                placeholder="Seleccione"
              />
              <CustomSelect
                label="Actividad"
                name="evaluative_activity"
                options={evaluativeActivityOptions}
                value={formik.values.evaluative_activity}
                onChange={(option) =>
                  formik.setFieldValue("evaluative_activity", option.value)
                }
                onBlur={formik.handleBlur}
                error={
                  formik.touched.evaluative_activity
                    ? formik.errors.evaluative_activity
                    : undefined
                }
                className={selectClassname}
                placeholder="Seleccione"
              />
            </>
          )}

          <CustomSelect
            label="Tipo"
            name="grading_mode"
            options={gradeTypeOptions}
            value={formik.values.grading_mode}
            onChange={(option) =>
              formik.setFieldValue("grading_mode", option.value)
            }
            onBlur={formik.handleBlur}
            error={
              formik.touched.grading_mode
                ? formik.errors.grading_mode
                : undefined
            }
            className={selectClassname}
            placeholder="Seleccione"
          />

          <CustomInput
            label="Puntaje (0-10)"
            name="numeric_score"
            value={formik.values.numeric_score ?? ""}
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue(
                "numeric_score",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            type="number"
            min={0}
            max={10}
            error={
              formik.touched.numeric_score
                ? formik.errors.numeric_score
                : undefined
            }
            className={inputClassname}
          />

          <CustomSelect
            label="Escala Cualitativa"
            name="qualitative_scale"
            options={qualitativeScaleOptions}
            value={formik.values.qualitative_scale}
            onChange={(option) =>
              formik.setFieldValue("qualitative_scale", option.value)
            }
            onBlur={formik.handleBlur}
            error={
              formik.touched.qualitative_scale
                ? formik.errors.qualitative_scale
                : undefined
            }
            className={selectClassname}
            placeholder="Seleccione"
          />

          <CustomInput
            label="Observación"
            name="teacher_observation"
            value={formik.values.teacher_observation}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={
              formik.touched.teacher_observation
                ? formik.errors.teacher_observation
                : undefined
            }
            className={inputClassname}
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover"
            >
              {formik.isSubmitting && (
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isEdit ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
