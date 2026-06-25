import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@app/routes";
import { useCustomFormik } from "@shared/hooks/useCustomFormik";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { authService } from "./auth.service";
import {
  loginPending,
  loginSuccess,
  loginError,
  refreshSuccess,
  refreshError,
  selectAuthError,
  selectAuthStatus,
} from "./auth.slice";
import { loginSchema } from "./auth.utils";
import { tokenManager } from "./auth-token.manager";

interface AuthFormValues {
  username: string;
  password: string;
}
const initialValues: AuthFormValues = { username: "", password: "" };

export const useAuthForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);

  const formik = useCustomFormik<AuthFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, helpers) => {
      try {
        dispatch(loginPending());
        const result = await authService.login(values);
        dispatch(loginSuccess({ user: result.user }));
        if (result.user.must_change_password) {
          navigate("/change-password", { replace: true });
        } else {
          navigate(PROTECTED_ROUTES.DASHBOARD, { replace: true });
        }
      } catch (err) {
        dispatch(
          loginError(
            err instanceof Error ? err.message : "Error al iniciar sesión",
          ),
        );
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return {
    formik,
    isLoading: formik.isSubmitting || status === "loading",
    authError,
  };
};

import type { AppDispatch } from "@shared/redux/store";

export async function refreshSession(dispatch: AppDispatch) {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) throw new Error("No hay refresh token disponible");
  try {
    const result = await authService.refreshTokens(refreshToken);
    dispatch(refreshSuccess({ user: result.user }));
    return result;
  } catch (err) {
    dispatch(refreshError());
    throw err;
  }
}
