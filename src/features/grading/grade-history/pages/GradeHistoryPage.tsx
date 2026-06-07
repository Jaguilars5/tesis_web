import { GradeHistoryTable } from "../components/GradeHistoryTable";

export default function GradeHistoryPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Historial de Calificaciones</h1>
          <p className="mt-1 text-sm text-slate-500">
            Consulta los cambios realizados en las calificaciones
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <GradeHistoryTable />
      </div>
    </div>
  );
}
