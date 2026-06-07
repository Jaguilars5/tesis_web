import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";

import { componentIndicatorSchema } from "../../presentation/utils/component-indicators.validation";

import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";
import type { ComponentIndicatorFormValues } from "../../presentation/hooks/useComponentIndicatorsForm";

interface ComponentIndicatorsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingComponentIndicator: ComponentIndicatorT | null;
  onSubmit: (values: ComponentIndicatorFormValues) => Promise<void>;
  blockComponentOptions: { label: string; value: string }[];
}

export const ComponentIndicatorsFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingComponentIndicator,
  onSubmit,
  blockComponentOptions,
}: ComponentIndicatorsFormModalProps) => {
  const getInitialValues = (): ComponentIndicatorFormValues => {
    if (editingComponentIndicator) {
      return {
        name: editingComponentIndicator.name,
        internal_weight: editingComponentIndicator.internal_weight,
        block_component: editingComponentIndicator.block_component,
      };
    }
    return {
      name: "",
      internal_weight: 0,
      block_component: 0,
    };
  };

  const formik = useFormik<ComponentIndicatorFormValues>({
    initialValues: getInitialValues(),
    validationSchema: componentIndicatorSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingComponentIndicator) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingComponentIndicator]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Indicador de Componente" : "Nuevo Indicador de Componente"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el indicador de componente académico
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
            label="Nombre"
            name="name"
            placeholder="Ej: Tareas, Lecciones..."
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Ponderación (%)"
            name="internal_weight"
            placeholder="0"
            value={formik.values.internal_weight}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            error={formik.touched.internal_weight ? formik.errors.internal_weight : undefined}
            className={inputClassname}
          />

          <CustomSelect
            label="Componente de Bloque"
            name="block_component"
            value={String(formik.values.block_component)}
            onBlur={formik.handleBlur}
            onChange={(value) => formik.setFieldValue("block_component", Number(value))}
            options={blockComponentOptions}
            error={formik.touched.block_component ? formik.errors.block_component : undefined}
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
