import { useAppSelector } from "@shared/redux/hooks";
import { selectAuthUser } from "../../auth/reducers/auth.selectors";
import { ProfileForm } from "../components/ProfileForm";

export default function ProfilePage() {
  const user = useAppSelector(selectAuthUser);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-full md:max-w-2xl">
      <div className="mb-4 md:mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Cuenta runtime
        </p>
        <h2 className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl">
          Perfil del usuario
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Datos decodificados desde el payload del JWT recibido por la API.
        </p>
      </div>

      <section className="rounded-2xl border border-border-soft bg-surface p-4 shadow-sm md:p-6">
        <ProfileForm user={user} />
      </section>
    </div>
  );
}
