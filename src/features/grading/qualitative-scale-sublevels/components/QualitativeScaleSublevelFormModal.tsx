import { useFormik } from "formik";
import { X } from "lucide-react";
import { selectClassname } from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { qssSchema } from "../qualitative-scale-sublevels.utils";
import type {
  QualitativeScaleSublevelFormValues,
  QualitativeScaleSublevelT,
} from "../qualitative-scale-sublevels.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingItem: QualitativeScaleSublevelT | null;
  onSubmit: (values: QualitativeScaleSublevelFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
  scaleOptions: { label: string; value: string }[];
  sublevelOptions: { label: string; value: string }[];
}

const getFieldLabel = (field: string): string =>
  ({ scale: "Escala", sublevel: "Subnivel", non_field_errors: "Error general" }[field] || field);

const getInitialValues = (
  editing?: QualitativeScaleSublevelT | null,
): QualitativeScaleSublevelFormValues => {
  if (editing)
    return { scale: editing.scale, sublevel: editing.sublevel };
  return { scale: 0, sublevel: 0 };
};

export const QualitativeScaleSublevelFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isEdit,
  editingItem,
  onSubmit,
  submitErrors,
  scaleOptions,
  sublevelOptions,
}) => {
  const formik = useFormik<QualitativeScaleSublevelFormValues>({
    initialValues: getInitialValues(editingItem),
    validationSchema: qssSchema,
    onSubmit,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar" : "Nueva"} Asignación
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Asocie una escala cualitativa a un subnivel
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
          <CustomSelect
            label="Escala Cualitativa"
            name="scale"
            value={String(formik.values.scale)}
            onChange={(option) =>
              formik.setFieldValue("scale", Number(option.value))
            }
            options={scaleOptions}
            className={selectClassname}
            error={formik.touched.scale ? formik.errors.scale : undefined}
          />

          <CustomSelect
            label="Subnivel Académico"
            name="sublevel"
            value={String(formik.values.sublevel)}
            onChange={(option) =>
              formik.setFieldValue("sublevel", Number(option.value))
            }
            options={sublevelOptions}
            className={selectClassname}
            error={
              formik.touched.sublevel ? formik.errors.sublevel : undefined
            }
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
