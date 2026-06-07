import { useFormik } from "formik";

import type { FormikErrors, FormikHelpers, FormikTouched } from "formik";
import type { AnyObjectSchema } from "yup";

type UseFormConfig<T> = {
  initialValues: T;
  validationSchema?: AnyObjectSchema;
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>,
  ) => void | Promise<void>;
  enableReinitialize?: boolean;
  validate?: (values: T) => void | Promise<FormikErrors<T>>;
};

interface UseCustomFormik<T> {
  dirty: boolean;
  enableReinitialize: boolean | undefined;
  errors: FormikErrors<T>;
  handleBlur: (e: React.FocusEvent<HTMLElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLElement>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  resetForm: FormikHelpers<T>["resetForm"];
  setFieldError: FormikHelpers<T>["setFieldError"];
  setFieldValue: FormikHelpers<T>["setFieldValue"];
  touched: FormikTouched<T>;
  values: T;
  validateForm: FormikHelpers<T>["validateForm"];
}

export const useCustomFormik = <T extends object>({
  initialValues,
  validationSchema,
  onSubmit,
  enableReinitialize,
  validate,
}: UseFormConfig<T>): UseCustomFormik<T> => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize,
    validate: validate,
  });

  return {
    dirty: formik.dirty,
    enableReinitialize,
    errors: formik.errors,
    handleBlur: formik.handleBlur,
    handleChange: formik.handleChange,
    handleSubmit: formik.handleSubmit,
    isSubmitting: formik.isSubmitting,
    resetForm: formik.resetForm,
    setFieldError: formik.setFieldError,
    setFieldValue: formik.setFieldValue,
    touched: formik.touched,
    values: formik.values,
    validateForm: formik.validateForm,
  };
};
