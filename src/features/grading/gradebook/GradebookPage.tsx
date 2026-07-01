import { CheckCircle, Loader2, Save, Search, Users } from "lucide-react";

import { selectClassname } from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form";

import { ExtendDueDateModal } from "./components/ExtendDueDateModal";
import { GradebookGradingBanner } from "./components/GradebookGradingBanner";
import { GradebookRoster } from "./components/GradebookRoster";
import { useGradebook } from "./hooks/useGradebook";

export default function GradebookPage() {
  const {
    roster,
    loadingRoster,
    saving,
    loaded,
    error,
    success,
    teacherSubjectSectionId,
    academicPeriodId,
    evaluativeActivityId,
    sectionOptions,
    periodOptions,
    activityOptions,
    maxScore,
    gradingContext,
    gradedCount,
    isLoading,
    loadingPeriods,
    loadingActivities,
    canLoad,
    canSave,
    extendDueDateOpen,
    extendingDueDate,
    extendDueDateError,
    setTeacherSubjectSectionId,
    setAcademicPeriodId,
    setEvaluativeActivityId,
    updateScore,
    updateObservation,
    loadRoster,
    saveGrades,
    openExtendDueDate,
    closeExtendDueDate,
    extendDueDate,
  } = useGradebook();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Libro de Calificaciones
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Seleccione la clase, el período y la actividad para registrar
            calificaciones
          </p>
        </div>
        {loaded && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">
                {roster.length}
              </span>{" "}
              estudiantes
              {gradedCount > 0 && (
                <>
                  {" "}
                  —{" "}
                  <span className="font-semibold text-emerald-600">
                    {gradedCount}
                  </span>{" "}
                  calificados
                </>
              )}
            </span>
            <button
              type="button"
              onClick={saveGrades}
              disabled={!canSave || saving}
              title={
                !canSave && loaded
                  ? "No hay cambios válidos para guardar o el período no permite calificar"
                  : undefined
              }
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {saving ? "Guardando..." : "Guardar Calificaciones"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          <Users className="size-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          <CheckCircle className="size-4 shrink-0" />
          ¡Calificaciones guardadas con éxito!
        </div>
      )}

      <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <div className="min-w-48 flex-1">
            <CustomSelect
              label="Clase"
              name="teacher_subject_section"
              placeholder={isLoading ? "Cargando..." : "Seleccionar Clase..."}
              value={
                teacherSubjectSectionId ? String(teacherSubjectSectionId) : ""
              }
              onChange={(o) =>
                setTeacherSubjectSectionId(o.value ? Number(o.value) : null)
              }
              options={sectionOptions}
              disabled={isLoading}
              className={selectClassname}
            />
          </div>
          <div className="min-w-40 flex-1">
            <CustomSelect
              label="Período"
              name="academic_period"
              placeholder={
                loadingPeriods ? "Cargando..." : "Seleccionar Período..."
              }
              value={academicPeriodId ? String(academicPeriodId) : ""}
              onChange={(o) =>
                setAcademicPeriodId(o.value ? Number(o.value) : null)
              }
              options={periodOptions}
              disabled={loadingPeriods}
              className={selectClassname}
            />
          </div>
          <div className="min-w-48 flex-1">
            <CustomSelect
              label="Actividad"
              name="evaluative_activity"
              placeholder={
                loadingActivities
                  ? "Cargando..."
                  : !teacherSubjectSectionId
                    ? "Seleccione una clase primero"
                    : !academicPeriodId
                      ? "Seleccione un período primero"
                      : activityOptions.length === 0
                        ? "Sin actividades en este período"
                        : "Seleccionar Actividad..."
              }
              value={evaluativeActivityId ? String(evaluativeActivityId) : ""}
              onChange={(o) =>
                setEvaluativeActivityId(o.value ? Number(o.value) : null)
              }
              options={activityOptions}
              disabled={
                !teacherSubjectSectionId ||
                !academicPeriodId ||
                loadingActivities ||
                activityOptions.length === 0
              }
              className={selectClassname}
            />
          </div>
          <button
            type="button"
            onClick={loadRoster}
            disabled={!canLoad || loadingRoster}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingRoster ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loadingRoster ? "Cargando..." : "Cargar"}
          </button>
        </div>

        {loaded && gradingContext && (
          <div className="border-b border-slate-200 px-4 py-3">
            <GradebookGradingBanner
              gradingContext={gradingContext}
              roster={roster}
              onExtendDueDate={openExtendDueDate}
            />
          </div>
        )}

        {loaded ? (
          <GradebookRoster
            roster={roster}
            maxScore={maxScore}
            gradingContext={gradingContext}
            updateScore={updateScore}
            updateObservation={updateObservation}
          />
        ) : (
          <div className="py-16 text-center text-sm text-slate-400">
            Seleccione la clase, el período y la actividad, luego haga clic en
            &quot;Cargar&quot;
          </div>
        )}
      </div>

      {gradingContext && (
        <ExtendDueDateModal
          isOpen={extendDueDateOpen}
          gradingContext={gradingContext}
          saving={extendingDueDate}
          error={extendDueDateError}
          onClose={closeExtendDueDate}
          onSubmit={extendDueDate}
        />
      )}
    </div>
  );
}
