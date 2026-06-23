import { GraduationCap } from "lucide-react";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="mx-auto bg-primary text-white rounded-2xl p-3 w-fit shadow-md"><GraduationCap className="size-7" /></div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-800">EduManager</h1>
          <p className="mt-1 text-sm text-slate-500">Sistema integral de gestion academica</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Acceso seguro</p>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-slate-400">Ingresa con tus credenciales institucionales</p>
      </div>
    </main>
  );
}
