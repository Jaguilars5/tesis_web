import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCustomFormik } from "@shared/hooks/useCustomFormik";
import { PROTECTED_ROUTES } from "@app/routes";
import { login } from "../../reducers/auth.reducer";
import { selectAuthError, selectAuthStatus } from "../../reducers/auth.selectors";
import { loginSchema } from "../utils/auth.validation";

interface AuthFormValues {
  username: string;
  password: string;
}

const initialValues: AuthFormValues = {
  username: "",
  password: "",
};

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
        await dispatch(login(values)).unwrap();
        navigate(PROTECTED_ROUTES.DASHBOARD, { replace: true });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const isLoading = formik.isSubmitting || status === "loading";

  return {
    formik,
    isLoading,
    authError,
  };
};
