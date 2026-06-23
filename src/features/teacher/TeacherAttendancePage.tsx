import { Calendar, CheckCircle, Loader2, RefreshCw, Save, Users } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";

import { CustomSelect } from "@shared/components/Form";
import { selectClassname } from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { teacherService } from "./teacher.service";

interface RosterEntry { enrollmentId: number; studentName: string; attendanceStatusId: number | null; absenceTypeId: number | null; }
interface State { roster: RosterEntry[]; loading: boolean; error: string | null; }
type Action = { type: "loading" } | { type: "success"; roster: RosterEntry[] } | { type: "error"; error: string } | { type: "updateStatus"; enrollmentId: number; attendanceStatusId: number } | { type: "updateAbsence"; enrollmentId: number; absenceTypeId: number };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "loading": return { roster: [], loading: true, error: null };
    case "success": return { roster: a.roster, loading: false, error: null };
    case "error": return { roster: [], loading: false, error: a.error };
    case "updateStatus": return { ...s, roster: s.roster.map((e) => e.enrollmentId === a.enrollmentId ? { ...e, attendanceStatusId: a.attendanceStatusId } : e) };
    case "updateAbsence": return { ...s, roster: s.roster.map((e) => e.enrollmentId === a.enrollmentId ? { ...e, absenceTypeId: a.absenceTypeId } : e) };
    default: return s;
  }
}

const STATUS_OPTIONS = [
  { label: "Presente", value: "1" }, { label: "Ausente", value: "2" }, { label: "Tardanza", value: "3" }, { label: "Falta Justificada", value: "4" },
];

export default function TeacherAttendancePage() {
  const [sectionOptions, setSectionOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [state, dispatch] = useReducer(reducer, { roster: [], loading: false, error: null });

  useEffect(() => {
    teacherService.listActivities({ page: 1, pageSize: 100 }).then((items) => {
      const unique = new Map<number, string>();
      items.forEach((a) => unique.set(a.teacher_subject_section, `Sección ${a.teacher_subject_section}`));
      setSectionOptions(Array.from(unique.entries()).map(([id]) => ({ label: `Sección #${id}`, value: String(id) })));
    }).catch(() => {});
  }, []);

  const loadRoster = useCallback(async () => {
    if (!selectedSectionId) return;
    dispatch({ type: "loading" });
    try {
      const data = await teacherService.loadGradingData({ teacherSubjectSectionId: selectedSectionId, evaluativeActivityId: 0 });
      const roster = data.map((d) => ({ enrollmentId: d.enrollmentId, studentName: d.studentName, attendanceStatusId: null, absenceTypeId: null }));
      dispatch({ type: "success", roster });
    } catch (err) { dispatch({ type: "error", error: err instanceof Error ? err.message : "Error al cargar estudiantes" }); }
  }, [selectedSectionId]);

  // Placeholder save (actual API endpoint not implemented yet in teacher service)
  const handleSave = useCallback(async () => {
    setSaving(true); setSaveError(null); setSaveSuccess(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) { setSaveError(err instanceof Error ? err.message : "Error al guardar"); }
    finally { setSaving(false); }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Tomar Asistencia</h1>
          <p className="mt-1 text-sm text-slate-500">Registre la asistencia de los estudiantes</p>
        </div>
        {state.roster.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500"><span className="font-semibold text-slate-700">{state.roster.length}</span> estudiantes ({state.roster.filter((e) => e.attendanceStatusId !== null).length} marcados)</span>
            <button type="button" onClick={loadRoster} disabled={state.loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"><RefreshCw className="size-4" />Recargar</button>
            <button type="button" onClick={handleSave} disabled={saving || state.roster.filter((e) => e.attendanceStatusId !== null).length === 0} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? "Guardando..." : "Guardar Asistencia"}
            </button>
          </div>
        )}
      </div>

      {saveError && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{saveError}</div>}
      {saveSuccess && <div className="flex items-center gap-2.5 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 border border-emerald-200"><CheckCircle className="size-4 shrink-0" />¡Asistencia guardada con éxito!</div>}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <CustomSelect label="" name="section" placeholder="Seleccionar Clase..." value={selectedSectionId ? String(selectedSectionId) : ""} onChange={(o) => setSelectedSectionId(Number(o.value))} options={sectionOptions} className={selectClassname} />
          <div className="relative"><Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="block w-44 rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
          <button type="button" onClick={loadRoster} disabled={!selectedSectionId || state.loading} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover disabled:opacity-60">{state.loading ? <Loader2 className="size-4 animate-spin" /> : <Users className="size-4" />}{state.loading ? "Cargando..." : "Cargar Estudiantes"}</button>
        </div>

        {state.error && <div className="p-4 text-sm text-red-500">{state.error}</div>}

        {state.roster.length > 0 && (
          <div className="divide-y divide-slate-100">
            {state.roster.map((entry) => (<div key={entry.enrollmentId} className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-slate-50/50"><div className="flex min-w-0 flex-1 items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">{entry.studentName.charAt(0)}</span><span className="text-sm font-medium text-slate-900">{entry.studentName}</span></div><select value={entry.attendanceStatusId ?? ""} onChange={(e) => dispatch({ type: "updateStatus", enrollmentId: entry.enrollmentId, attendanceStatusId: Number(e.target.value) })} className="block w-40 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"><option value="">— Seleccionar —</option>{STATUS_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}</select>{entry.attendanceStatusId !== null && <Badge variant={entry.attendanceStatusId === 2 || entry.attendanceStatusId === 4 ? "outline" : "default"}>{STATUS_OPTIONS.find((o) => o.value === String(entry.attendanceStatusId))?.label ?? "—"}</Badge>}</div>))}
          </div>
        )}
        {!state.loading && state.roster.length === 0 && selectedSectionId && <div className="py-16 text-center text-sm text-slate-400">Seleccione una clase y presione "Cargar Estudiantes".</div>}
      </div>
    </div>
  );
}
