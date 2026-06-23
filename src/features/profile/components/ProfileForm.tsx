import { Save } from "lucide-react";
import { useCallback } from "react";

import { profileSchema } from "../profile.utils";
import { profileService } from "../profile.service";
import { selectAuthUser, userUpdated } from "@features/auth/auth.slice";
import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCustomFormik } from "@shared/hooks/useCustomFormik";

import type { ProfileFormValues } from "../profile.types";

export function ProfileForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const onSubmit = useCallback(
    async (values: ProfileFormValues) => {
      if (!user) return;
      const updated = await profileService.update(user.id, values);
      dispatch(userUpdated(updated));
    },
    [user, dispatch],
  );

  const formik = useCustomFormik<ProfileFormValues>({
    initialValues: {
      names: user?.names ?? "",
      last_names: user?.last_names ?? "",
      email: user?.email ?? "",
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit,
  });

  if (!user) return null;

  return (
    <form className="grid gap-5" onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          label="Nombres"
          name="names"
          type="text"
          value={formik.values.names}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.names ? formik.errors.names : undefined}
          className={inputClassname}
          disabled={formik.isSubmitting}
        />
        <CustomInput
          label="Apellidos"
          name="last_names"
          type="text"
          value={formik.values.last_names}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.last_names ? formik.errors.last_names : undefined}
          className={inputClassname}
          disabled={formik.isSubmitting}
        />
      </div>
      <CustomInput
        label="Correo"
        name="email"
        type="email"
        value={formik.values.email}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        error={formik.touched.email ? formik.errors.email : undefined}
        className={inputClassname}
        disabled={formik.isSubmitting}
      />

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formik.isSubmitting ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="size-4" />
            Guardar perfil
          </>
        )}
      </button>
    </form>
  );
}
