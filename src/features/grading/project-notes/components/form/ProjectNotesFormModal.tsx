import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect, CustomTextArea } from "@shared/components/Form";

import { projectNoteSchema } from "../../presentation/utils/project-notes.validation";

import type { ProjectNoteT } from "../../domain/entities/project-notes.types";
import type { ProjectNoteFormValues } from "../../presentation/hooks/useProjectNotesForm";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";

interface ProjectNotesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingProjectNote: ProjectNoteT | null;
  onSubmit: (values: ProjectNoteFormValues) => Promise<void>;
  enrollmentOptions: SelectOptionT[];
  interdisciplinaryProjectOptions: SelectOptionT[];
}

const SYNC_STATUS_OPTIONS: SelectOptionT[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "SINCRONIZADO", label: "Sincronizado" },
  { value: "ERROR", label: "Error" },
];

export const ProjectNotesFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingProjectNote,
  onSubmit,
  enrollmentOptions,
  interdisciplinaryProjectOptions,
}: ProjectNotesFormModalProps) => {
  const getInitialValues = (): ProjectNoteFormValues => {
    if (editingProjectNote) {
      return {
        enrollment: editingProjectNote.enrollment ?? "",
        interdisciplinary_project: editingProjectNote.interdisciplinary_project ?? "",
        product_score: editingProjectNote.product_score ?? null,
        presentation_score: editingProjectNote.presentation_score ?? null,
        final_score: editingProjectNote.final_score ?? null,
        observation: editingProjectNote.observation ?? "",
        sync_status: editingProjectNote.sync_status,
      };
    }
    return {
      enrollment: "",
      interdisciplinary_project: "",
      product_score: null,
      presentation_score: null,
      final_score: null,
      observation: "",
      sync_status: "PENDIENTE",
    };
  };

  const formik = useFormik<ProjectNoteFormValues>({
    initialValues: getInitialValues(),
    validationSchema: projectNoteSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingProjectNote) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingProjectNote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Nota de Proyecto Interdisciplinario" : "Nueva Nota de Proyecto Interdisciplinario"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit ? "Modifique los datos de la nota" : "Registre una nueva nota de proyecto interdisciplinario"}
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
          {isEdit && editingProjectNote && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <p><strong>Matrícula:</strong> {editingProjectNote.enrollment_name}</p>
              <p><strong>Proyecto:</strong> {editingProjectNote.interdisciplinary_project_title}</p>
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
                label="Proyecto Interdisciplinario"
                name="interdisciplinary_project"
                options={interdisciplinaryProjectOptions}
                value={formik.values.interdisciplinary_project}
                onChange={(option) => formik.setFieldValue("interdisciplinary_project", option.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.interdisciplinary_project ? formik.errors.interdisciplinary_project : undefined}
                className={selectClassname}
                placeholder="Seleccione un proyecto"
              />
            </>
          )}

          <CustomInput
            label="Nota del Producto (0-10)"
            name="product_score"
            placeholder="0"
            value={formik.values.product_score ?? ""}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const val = e.target.value;
              formik.setFieldValue("product_score", val === "" ? null : Number(val));
            }}
            type="number"
            min={0}
            max={10}
            error={formik.touched.product_score ? formik.errors.product_score : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Nota de Exposición (0-10)"
            name="presentation_score"
            placeholder="0"
            value={formik.values.presentation_score ?? ""}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const val = e.target.value;
              formik.setFieldValue("presentation_score", val === "" ? null : Number(val));
            }}
            type="number"
            min={0}
            max={10}
            error={formik.touched.presentation_score ? formik.errors.presentation_score : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Nota Final (0-10)"
            name="final_score"
            placeholder="0"
            value={formik.values.final_score ?? ""}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const val = e.target.value;
              formik.setFieldValue("final_score", val === "" ? null : Number(val));
            }}
            type="number"
            min={0}
            max={10}
            error={formik.touched.final_score ? formik.errors.final_score : undefined}
            className={inputClassname}
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
            label="Observación"
            name="observation"
            placeholder="Observación opcional..."
            value={formik.values.observation}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.observation ? formik.errors.observation : undefined}
            rows={3}
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
