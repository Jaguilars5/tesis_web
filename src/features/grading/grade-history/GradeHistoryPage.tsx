import { useAppSelector } from "@shared/redux/hooks";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { hasPermission } from "@shared/utils/permissions";

import { useGradeHistoryController } from "./hooks/useGradeHistoryController";
import { GradeHistoryTable } from "./components/GradeHistoryTable";
import { GRADE_HISTORY_PERMISSIONS } from "./grade-history.constants";

export default function GradeHistoryPage() {
  const permissions = useAppSelector(selectUserPermissions);
  const canView = hasPermission(permissions, GRADE_HISTORY_PERMISSIONS.GET);

  const { items, isLoading, loadItems } = useGradeHistoryController();

  if (!canView) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Historial de Calificaciones</h1>
          <p className="mt-1 text-sm text-slate-500">Consulta los cambios realizados en las calificaciones</p>
        </div>
      </div>
      <GradeHistoryTable gradeHistoryItems={items} isLoading={isLoading} loadGradeHistory={loadItems} />
    </div>
  );
}
