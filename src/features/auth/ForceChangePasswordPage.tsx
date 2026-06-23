import { KeyRound, Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { selectAuthUser, sessionExpired, userUpdated } from "./auth.slice";

export default function ForceChangePasswordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) { navigate("/login", { replace: true }); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordErrors([]);
    if (newPassword !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    if (newPassword.length < 12) { setError("La contraseña debe tener al menos 12 caracteres"); return; }
    setIsLoading(true);
    try {
      await apiClient.post(`/api/iam/users/${user.id}/change-password/`, { new_password: newPassword });
      dispatch(userUpdated({ ...user, must_change_password: false }));
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { password_errors?: string[]; msg?: string }; status?: number } };
      if (axiosError.response?.data?.password_errors) setPasswordErrors(axiosError.response.data.password_errors);
      else if (axiosError.response?.status === 401) { dispatch(sessionExpired()); navigate("/login", { replace: true }); }
      else setError(getApiErrorMessage(err));
    } finally { setIsLoading(false); }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="mx-auto bg-amber-500 text-white rounded-2xl p-3 w-fit shadow-md"><ShieldAlert className="size-7" /></div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-800">Cambio de Contraseña Obligatorio</h1>
          <p className="mt-2 text-sm text-slate-500">Por seguridad, debes cambiar tu contraseña antes de continuar.</p>
        </div>
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
          <p className="font-medium">Usuario: <span className="font-bold">{user.username}</span></p>
          {user.dni && <p className="mt-1">Tu contraseña actual es tu número de documento: <span className="font-mono font-bold">{user.dni}</span></p>}
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">Nueva Contraseña</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input id="newPassword" type="password" placeholder="Nueva contraseña" autoComplete="new-password" disabled={isLoading} value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-60" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirmar Contraseña</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input id="confirmPassword" type="password" placeholder="Confirmar contraseña" autoComplete="new-password" disabled={isLoading} value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-60" />
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm font-semibold text-danger">{error}</p>}
          {passwordErrors.length > 0 && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-danger">
              <p className="font-semibold mb-1">La contraseña no cumple los requisitos:</p>
              <ul className="list-disc list-inside space-y-0.5">{passwordErrors.map((err, i) => <li key={i}>{err}</li>)}</ul>
            </div>
          )}
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
            <p className="font-medium">Requisitos mínimos:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5"><li>Mínimo 12 caracteres</li><li>No puede ser una contraseña común</li><li>No puede ser solo números</li><li>No puede ser similar a tus datos personales</li></ul>
          </div>
          <button className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white rounded-lg text-sm font-bold px-4 py-2.5 transition hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed shadow-sm" disabled={isLoading} type="submit">
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
            {isLoading ? "Cambiando contraseña..." : "Cambiar Contraseña"}
          </button>
        </form>
      </div>
    </main>
  );
}
