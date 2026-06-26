import { useFormik } from "formik";
import { KeyRound, X } from "lucide-react";
import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { changePasswordSchema } from "../users.utils";
import type { UserT } from "../users.types";

interface Props {
  isOpen: boolean;
  entity: UserT | null;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
}

export const ChangePasswordModal: React.FC<Props> = ({
  isOpen,
  entity,
  onClose,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: { new_password: "" },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      await onSubmit(values.new_password);
      formik.resetForm();
      onClose();
    },
  });

  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={formik.isSubmitting ? undefined : onClose} />
      <div className="relative w-full max-w-sm animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <KeyRound className="size-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Cambiar Contraseña</h3>
              <p className="text-sm text-slate-500">{entity.names} {entity.last_names}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={formik.isSubmitting} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput
            label="Nueva Contraseña"
            name="new_password"
            value={formik.values.new_password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="password"
            error={formik.touched.new_password ? formik.errors.new_password : undefined}
            className={inputClassname}
            disabled={formik.isSubmitting}
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} disabled={formik.isSubmitting} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
              Cancelar
            </button>
            <button type="submit" disabled={formik.isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
              {formik.isSubmitting ? (
                <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Cambiando...</>
              ) : "Cambiar Contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
