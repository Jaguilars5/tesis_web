import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";

import { blockComponentSchema } from "../../presentation/utils/block-components.validation";

import type { BlockComponentT } from "../../domain/entities/block-components.types";
import type { BlockComponentFormValues } from "../../presentation/hooks/useBlockComponentsForm";

interface BlockComponentsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingBlockComponent: BlockComponentT | null;
  onSubmit: (values: BlockComponentFormValues) => Promise<void>;
}

export const BlockComponentsFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingBlockComponent,
  onSubmit,
}: BlockComponentsFormModalProps) => {
  const getInitialValues = (): BlockComponentFormValues => {
    if (editingBlockComponent) {
      return {
        name: editingBlockComponent.name,
        internal_weight: editingBlockComponent.internal_weight,
        evaluation_block: editingBlockComponent.evaluation_block,
      };
    }
    return {
      name: "",
      internal_weight: 0,
      evaluation_block: 0,
    };
  };

  const formik = useFormik<BlockComponentFormValues>({
    initialValues: getInitialValues(),
    validationSchema: blockComponentSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingBlockComponent) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingBlockComponent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Componente de Bloque" : "Nuevo Componente de Bloque"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el componente de bloque de evaluación
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
            placeholder="Ej: Tareas, Examen..."
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
            placeholder="0 - 100"
            value={formik.values.internal_weight}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            error={formik.touched.internal_weight ? formik.errors.internal_weight : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="ID Bloque de Evaluación"
            name="evaluation_block"
            placeholder="ID del bloque"
            value={formik.values.evaluation_block}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            error={formik.touched.evaluation_block ? formik.errors.evaluation_block : undefined}
            className={inputClassname}
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
