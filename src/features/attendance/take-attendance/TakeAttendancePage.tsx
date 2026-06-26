import {
  Calendar,
  CheckCircle,
  Loader2,
  RefreshCw,
  Save,
  Search,
  Users,
} from "lucide-react";

import { CustomSelect } from "@shared/components/Form";

import { AttendanceRoster } from "./components/AttendanceRoster";
import { useTakeAttendance } from "./hooks/useTakeAttendance";

export default function TakeAttendancePage() {
  const {
    roster,
    loadingRoster,
    saving,
    loaded,
    error,
    success,
    teacherSubjectSectionId,
    academicPeriodId,
    attendanceDate,
    teacherSubjectSectionOptions,
    academicPeriodOptions,
    attendanceStatusOptions,
    absenceTypeOptions,
    isLoading,
    canLoad,
    canSave,
    setTeacherSubjectSectionId,
    setAcademicPeriodId,
    setAttendanceDate,
    updateRosterEntry,
    loadRoster,
    saveAttendance,
  } = useTakeAttendance();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Tomar Asistencia
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Seleccione la clase, período y fecha para registrar la asistencia
          </p>
        </div>
        {loaded && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">
                {roster.length}
              </span>{" "}
              estudiantes
              {roster.filter((e) => e.attendanceStatusId !== null).length >
                0 && (
                <>
                  {" "}
                  —{" "}
                  <span className="font-semibold text-emerald-600">
                    {roster.filter((e) => e.attendanceStatusId !== null).length}
                  </span>{" "}
                  marcados
                </>
              )}
            </span>
            <button
              type="button"
              onClick={loadRoster}
              disabled={loadingRoster}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className="size-4" />
              Recargar
            </button>
            <button
              type="button"
              onClick={saveAttendance}
              disabled={!canSave || saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {saving ? "Guardando..." : "Guardar Asistencia"}
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
        <div className="flex items-center gap-2.5 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 border border-emerald-200">
          <CheckCircle className="size-4 shrink-0" />
          ¡Asistencia guardada con éxito!
        </div>
      )}

      <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <CustomSelect
            label=""
            name="teacher_subject_section"
            placeholder="Seleccionar Clase..."
            onChange={(option) =>
              setTeacherSubjectSectionId(
                option.value ? Number(option.value) : null,
              )
            }
            options={teacherSubjectSectionOptions}
            className={{
              container: "relative min-w-48 flex-1",
              label: "sr-only",
              select:
                "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              error: "mt-1 text-xs text-red-500",
            }}
            disabled={isLoading}
            value={
              teacherSubjectSectionId ? String(teacherSubjectSectionId) : ""
            }
          />
          <CustomSelect
            label=""
            name="academic_period"
            placeholder="Seleccionar Período..."
            onChange={(option) =>
              setAcademicPeriodId(option.value ? Number(option.value) : null)
            }
            options={academicPeriodOptions}
            className={{
              container: "relative min-w-48 flex-1",
              label: "sr-only",
              select:
                "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              error: "mt-1 text-xs text-red-500",
            }}
            disabled={isLoading}
            value={academicPeriodId ? String(academicPeriodId) : ""}
          />
          <div className="relative min-w-40 flex-1 max-w-[12rem]">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={loadRoster}
            disabled={!canLoad || loadingRoster}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingRoster ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loadingRoster ? "Cargando..." : "Cargar"}
          </button>
        </div>

        {loaded ? (
          <AttendanceRoster
            roster={roster}
            attendanceStatusOptions={attendanceStatusOptions}
            absenceTypeOptions={absenceTypeOptions}
            updateRosterEntry={updateRosterEntry}
          />
        ) : (
          <div className="py-16 text-center text-sm text-slate-400">
            Seleccione la clase, período y fecha, luego haga clic en "Cargar"
          </div>
        )}
      </div>
    </div>
  );
}
