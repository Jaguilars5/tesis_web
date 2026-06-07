import * as Yup from "yup";

export const representativeSchema = Yup.object({
  dni: Yup.string().required("Cedula requerida"),
  names: Yup.string().required("Nombres requeridos"),
  last_names: Yup.string().required("Apellidos requeridos"),
  phone: Yup.string().required("Telefono requerido"),
  email: Yup.string().email("Correo invalido").nullable(),
  address: Yup.string().nullable(),
});

export type RepresentativeFormValues = {
  dni: string;
  names: string;
  last_names: string;
  phone: string;
  email: string | null;
  address: string | null;
};
