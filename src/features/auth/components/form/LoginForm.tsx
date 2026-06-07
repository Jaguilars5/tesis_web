import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import type { FormikErrors, FormikTouched } from "formik";
import { Loader2, LogIn } from "lucide-react";
import { useAuthForm } from "../../presentation/hooks/useAuthForm";

interface FormValues {
  username: string;
  password: string;
}

const getFieldError = (
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  field: keyof FormValues,
): string | undefined => {
  return touched[field] && errors[field] ? String(errors[field]) : undefined;
};

export const LoginForm = () => {
  const { formik, isLoading, authError } = useAuthForm();

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <div className="space-y-1.5">
        <CustomInput
          label="Usuario"
          id="username"
          name="username"
          type="text"
          placeholder="admin"
          autoComplete="username"
          disabled={isLoading}
          value={formik.values.username}
          className={{ ...inputClassname }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          aria-invalid={!!(formik.touched.username && formik.errors.username)}
          error={getFieldError(formik.errors, formik.touched, "username")}
        />
      </div>

      <div className="space-y-1.5">
        <CustomInput
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          placeholder="********"
          autoComplete="current-password"
          disabled={isLoading}
          value={formik.values.password}
          className={{ ...inputClassname }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={getFieldError(formik.errors, formik.touched, "password")}
          aria-invalid={!!(formik.touched.password && formik.errors.password)}
        />
      </div>

      {authError && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm font-semibold text-danger">
          {authError}
        </p>
      )}

      <button
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white rounded-lg text-sm font-bold px-4 py-2.5 transition hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogIn className="size-4" />
        )}
        {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
      </button>
    </form>
  );
};
