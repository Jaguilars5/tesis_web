import { PROTECTED_ROUTES } from "@app/routes";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          Pagina no encontrada
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          La ruta solicitada no existe o fue movida.
        </p>
        <Link to={PROTECTED_ROUTES.DASHBOARD} className="btn-primary mt-6">
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
