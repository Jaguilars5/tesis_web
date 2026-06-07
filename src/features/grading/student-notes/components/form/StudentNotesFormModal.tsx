import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput, CustomSelect, CustomTextArea } from "@shared/components/Form";

import { studentNoteSchema } from "../../presentation/utils/student-notes.validation";

import type { StudentNoteT } from "../../domain/entities/student-notes.types";
import type { StudentNoteFormValues } from "../../presentation/hooks/useStudentNotesForm";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";

interface StudentNotesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingStudentNote: StudentNoteT | null;
  onSubmit: (values: StudentNoteFormValues) => Promise<void>;
  enrollmentOptions: SelectOptionT[];
  evaluativeActivityOptions: SelectOptionT[];
  gradeTypeOptions: SelectOptionT[];
  qualitativeScaleOptions: SelectOptionT[];
}

const SYNC_STATUS_OPTIONS: SelectOptionT[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "SINCRONIZADO", label: "Sincronizado" },
  { value: "ERROR", label: "Error" },
];

export const StudentNotesFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingStudentNote,
  onSubmit,
  enrollmentOptions,
  evaluativeActivityOptions,
  gradeTypeOptions,
  qualitativeScaleOptions,
}: StudentNotesFormModalProps) => {
  const getInitialValues = (): StudentNoteFormValues => {
    if (editingStudentNote) {
      return {
        enrollment: editingStudentNote.enrollment ?? "",
        evaluative_activity: editingStudentNote.evaluative_activity ?? "",
        grade_type: editingStudentNote.grade_type ?? "",
        numeric_score: editingStudentNote.numeric_score ?? null,
        qualitative_scale: editingStudentNote.qualitative_scale ?? "",
        sync_status: editingStudentNote.sync_status,
        teacher_observation: editingStudentNote.teacher_observation ?? "",
        manually_overridden: editingStudentNote.manually_overridden,
      };
    }
    return {
      enrollment: "",
      evaluative_activity: "",
      grade_type: "",
      numeric_score: null,
      qualitative_scale: "",
      sync_status: "PENDIENTE",
      teacher_observation: "",
      manually_overridden: false,
    };
  };

  const formik = useFormik<StudentNoteFormValues>({
    initialValues: getInitialValues(),
    validationSchema: studentNoteSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingStudentNote) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingStudentNote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Nota de Estudiante" : "Nueva Nota de Estudiante"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit ? "Modifique los datos de la nota" : "Registre una nueva nota académica"}
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
          {isEdit && editingStudentNote && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <p><strong>Matrícula:</strong> {editingStudentNote.enrollment_name}</p>
              <p><strong>Actividad:</strong> {editingStudentNote.evaluative_activity_title}</p>
            </div>
          )}

          {!isEdit && (
            <>
              <CustomSelect
                label="Matrícula"
                name="enrollment"
                options={enrollmentOptions}
                value={formik.values.enrollment}
                onChange={(option) => formik.setFieldValue("enrollment", option.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.enrollment ? formik.errors.enrollment : undefined}
                className={selectClassname}
                placeholder="Seleccione una matrícula"
              />

              <CustomSelect
                label="Actividad Evaluativa"
                name="evaluative_activity"
                options={evaluativeActivityOptions}
                value={formik.values.evaluative_activity}
                onChange={(option) => formik.setFieldValue("evaluative_activity", option.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.evaluative_activity ? formik.errors.evaluative_activity : undefined}
                className={selectClassname}
                placeholder="Seleccione una actividad"
              />
            </>
          )}

          <CustomSelect
            label="Tipo de Calificación"
            name="grade_type"
            options={gradeTypeOptions}
            value={formik.values.grade_type}
            onChange={(option) => formik.setFieldValue("grade_type", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.grade_type ? formik.errors.grade_type : undefined}
            className={selectClassname}
            placeholder="Seleccione un tipo"
          />

          <CustomInput
            label="Puntaje (0-10)"
            name="numeric_score"
            placeholder="0"
            value={formik.values.numeric_score ?? ""}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const val = e.target.value;
              formik.setFieldValue("numeric_score", val === "" ? null : Number(val));
            }}
            type="number"
            min={0}
            max={10}
            error={formik.touched.numeric_score ? formik.errors.numeric_score : undefined}
            className={inputClassname}
          />

          <CustomSelect
            label="Escala Cualitativa"
            name="qualitative_scale"
            options={qualitativeScaleOptions}
            value={formik.values.qualitative_scale}
            onChange={(option) => formik.setFieldValue("qualitative_scale", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.qualitative_scale ? formik.errors.qualitative_scale : undefined}
            className={selectClassname}
            placeholder="Seleccione una escala"
          />

          <CustomSelect
            label="Estado de Sincronización"
            name="sync_status"
            options={SYNC_STATUS_OPTIONS}
            value={formik.values.sync_status}
            onChange={(option) => formik.setFieldValue("sync_status", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.sync_status ? formik.errors.sync_status : undefined}
            className={selectClassname}
          />

          <CustomTextArea
            label="Observación del Docente"
            name="teacher_observation"
            placeholder="Observación opcional..."
            value={formik.values.teacher_observation}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.teacher_observation ? formik.errors.teacher_observation : undefined}
            rows={3}
          />

          <div className="flex items-end pb-1">
            <CustomCheckbox
              name="manually_overridden"
              checked={formik.values.manually_overridden}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Sobrescritura manual"
              className={checkboxClassname}
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
