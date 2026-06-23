import { CustomInput, CustomSelect } from "@shared/components/Form";
import { useCustomFormik } from "@shared/hooks/useCustomFormik";
import { Save } from "lucide-react";
import { profileSchema } from "@features/auth/auth.utils";
import type { AuthUserT } from "@features/auth/auth.types";

type ProfileFormProps = {
  user: AuthUserT;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const formik = useCustomFormik({
    initialValues: { name: user.names, email: user.email, role: user.role },
    validationSchema: profileSchema,
    onSubmit: () => undefined,
  });

  return (
    <form className="grid gap-5" onSubmit={formik.handleSubmit}>
      <CustomInput
        label="Nombre"
        name="name"
        type="text"
        value={formik.values.name}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        error={formik.touched.name ? formik.errors.name : undefined}
      />

      <CustomInput
        label="Correo"
        name="email"
        type="email"
        value={formik.values.email}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        error={formik.touched.email ? formik.errors.email : undefined}
      />

      <CustomSelect
        label="Rol"
        name="role"
        value={formik.values.role}
        onBlur={formik.handleBlur}
        onChange={(option) => formik.setFieldValue("role", option.value)}
        error={formik.touched.role ? formik.errors.role : undefined}
        options={[
          { label: "Super Admin", value: "Super Admin" },
          { label: "Administrador", value: "Administrador" },
          { label: "Docente", value: "Docente" },
          { label: "Usuario", value: "Usuario" },
        ]}
      />

      <button className="btn-primary w-fit" type="submit">
        <Save className="h-4 w-4" />
        Guardar perfil
      </button>
    </form>
  );
}
