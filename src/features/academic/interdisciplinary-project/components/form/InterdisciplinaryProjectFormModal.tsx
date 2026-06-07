import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";

import { interdisciplinaryProjectSchema } from "../../presentation/utils/interdisciplinary-project.validation";
import type { InterdisciplinaryProjectFormValues } from "../../presentation/hooks/useInterdisciplinaryProjectForm";
import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";

interface InterdisciplinaryProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingInterdisciplinaryProject: InterdisciplinaryProjectT | null;
  onSubmit: (values: InterdisciplinaryProjectFormValues) => Promise<void>;
}

export const InterdisciplinaryProjectFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingInterdisciplinaryProject,
  onSubmit,
}: InterdisciplinaryProjectFormModalProps) => {
  const getInitialValues = (): InterdisciplinaryProjectFormValues => {
    if (editingInterdisciplinaryProject) {
      return {
        title: editingInterdisciplinaryProject.title,
        description: editingInterdisciplinaryProject.description,
        start_date: editingInterdisciplinaryProject.start_date,
        delivery_date: editingInterdisciplinaryProject.delivery_date,
        is_active: editingInterdisciplinaryProject.is_active,
        academic_period: editingInterdisciplinaryProject.academic_period,
      };
    }
    return {
      title: "",
      description: null,
      start_date: "",
      delivery_date: "",
      is_active: true,
      academic_period: 0,
    };
  };

  const formik = useFormik<InterdisciplinaryProjectFormValues>({
    initialValues: getInitialValues(),
    validationSchema: interdisciplinaryProjectSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingInterdisciplinaryProject) {
      formik.setValues(getInitialValues());
    }
  }, [isOpen, editingInterdisciplinaryProject]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Gestione los proyectos academicos integrados
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
          <CustomInput
            label="Titulo"
            name="title"
            placeholder="Proyecto integrador"
            value={formik.values.title}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.title ? formik.errors.title : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Descripcion"
            name="description"
            placeholder="Descripcion del proyecto"
            value={formik.values.description ?? ""}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.description ? formik.errors.description : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Fecha de inicio"
            name="start_date"
            type="date"
            value={formik.values.start_date}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.start_date ? formik.errors.start_date : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Fecha de entrega"
            name="delivery_date"
            type="date"
            value={formik.values.delivery_date}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.delivery_date ? formik.errors.delivery_date : undefined}
            className={inputClassname}
          />

          <div className="flex items-end pb-1">
            <CustomCheckbox
              name="is_active"
              checked={formik.values.is_active}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Activo"
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
