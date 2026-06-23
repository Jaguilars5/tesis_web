import { Loader2, Save, Search } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";

import { tableClassname, tableColumnsClassname, tableFirstColumnClassname } from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form";
import { CustomTable } from "@shared/components/Table";
import { teacherService } from "./teacher.service";
import type { TableColumnProps } from "@shared/components/Table";
import type { RosterEntryT } from "./teacher.types";

interface RosterState { entries: RosterEntryT[]; loading: boolean; error: string | null; }
type RosterAction = { type: "loading" } | { type: "success"; entries: RosterEntryT[] } | { type: "error"; error: string } | { type: "update"; enrollmentId: number; field: "numericScore"; value: number | null } | { type: "updateObs"; enrollmentId: number; value: string };
function rosterReducer(s: RosterState, a: RosterAction): RosterState {
  switch (a.type) {
    case "loading": return { entries: [], loading: true, error: null };
    case "success": return { entries: a.entries, loading: false, error: null };
    case "error": return { entries: [], loading: false, error: a.error };
    case "update": return { ...s, entries: s.entries.map((e) => e.enrollmentId === a.enrollmentId ? { ...e, [a.field]: a.value } : e) };
    case "updateObs": return { ...s, entries: s.entries.map((e) => e.enrollmentId === a.enrollmentId ? { ...e, teacherObservation: a.value } : e) };
    default: return s;
  }
}

export default function TeacherGradingPage() {
  const [teacherSubjectSectionId, setTeacherSubjectSectionId] = useState<number | null>(null);
  const [evaluativeActivityId, setEvaluativeActivityId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [state, dispatch] = useReducer(rosterReducer, { entries: [], loading: false, error: null });
  const [sectionOptions, setSectionOptions] = useState<{ label: string; value: string }[]>([]);
  const [activityOptions, setActivityOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    teacherService.listActivities({ page: 1, pageSize: 100 }).then((items) => {
      const unique = new Map<number, string>();
      items.forEach((a) => unique.set(a.teacher_subject_section, `Sección ${a.teacher_subject_section}`));
      setSectionOptions(Array.from(unique.entries()).map(([id]) => ({ label: `Sección #${id}`, value: String(id) })));
      setActivityOptions(items.map((a) => ({ label: a.title, value: String(a.id) })));
    }).catch(() => {});
  }, []);

  const loadRoster = useCallback(async () => {
    if (!teacherSubjectSectionId || !evaluativeActivityId) return;
    dispatch({ type: "loading" });
    try {
      const entries = await teacherService.loadGradingData({ teacherSubjectSectionId, evaluativeActivityId });
      dispatch({ type: "success", entries });
    } catch (err) { dispatch({ type: "error", error: err instanceof Error ? err.message : "Error al cargar" }); }
  }, [teacherSubjectSectionId, evaluativeActivityId]);

  useEffect(() => { if (teacherSubjectSectionId && evaluativeActivityId) loadRoster(); }, [teacherSubjectSectionId, evaluativeActivityId, loadRoster]);

  const handleSave = useCallback(async () => {
    if (!evaluativeActivityId) return;
    setSaving(true); setSaveError(null); setSaveSuccess(false);
    try {
      await teacherService.saveGrades({ evaluativeActivityId, grades: state.entries.map((e) => ({ enrollmentId: e.enrollmentId, numericScore: e.numericScore, teacherObservation: e.teacherObservation })) });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) { setSaveError(err instanceof Error ? err.message : "Error al guardar"); }
    finally { setSaving(false); }
  }, [evaluativeActivityId, state.entries]);

  const cols: TableColumnProps<RosterEntryT>[] = [
    { key: "studentName", label: "Estudiante", className: tableFirstColumnClassname },
    { key: "numericScore", label: "Nota", className: tableColumnsClassname, render: (e) => (<input type="number" min={0} max={20} step={0.5} value={e.numericScore ?? ""} onChange={(ev) => { const v = ev.target.value; dispatch({ type: "update", enrollmentId: e.enrollmentId, field: "numericScore", value: v === "" ? null : Number(v) }); }} className="block w-24 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="—" />) },
    { key: "teacherObservation", label: "Observación", className: tableColumnsClassname, render: (e) => (<input type="text" value={e.teacherObservation ?? ""} onChange={(ev) => dispatch({ type: "updateObs", enrollmentId: e.enrollmentId, value: ev.target.value })} className="block w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Observación opcional" />) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Libro de Calificaciones</h1>
          <p className="mt-1 text-sm text-slate-500">Registre y gestione las calificaciones de los estudiantes</p>
        </div>
        {state.entries.length > 0 && (
          <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Guardando..." : "Guardar Calificaciones"}
          </button>
        )}
      </div>

      {saveError && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{saveError}</div>}
      {saveSuccess && <div className="rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 border border-emerald-200">¡Calificaciones guardadas con éxito!</div>}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <CustomSelect label="" name="section" placeholder="Seleccionar Sección..." value={teacherSubjectSectionId ? String(teacherSubjectSectionId) : ""} onChange={(o) => setTeacherSubjectSectionId(Number(o.value))} options={sectionOptions} className={{ container: "relative min-w-50 flex-1", label: "sr-only", select: "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", error: "mt-1 text-xs text-red-500" }} />
          <CustomSelect label="" name="activity" placeholder="Seleccionar Actividad..." value={evaluativeActivityId ? String(evaluativeActivityId) : ""} onChange={(o) => setEvaluativeActivityId(Number(o.value))} options={activityOptions} className={{ container: "relative min-w-50 flex-1", label: "sr-only", select: "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", error: "mt-1 text-xs text-red-500" }} />
          <button type="button" onClick={loadRoster} disabled={!teacherSubjectSectionId || !evaluativeActivityId} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"><Search className="size-4" />Cargar</button>
        </div>
        {(state.loading || state.error) && (<div className="px-4 py-3">{state.loading && <div className="flex items-center justify-center py-8"><Loader2 className="size-5 animate-spin text-slate-400" /></div>}{state.error && <div className="text-sm text-red-500">{state.error}</div>}</div>)}
        {!state.loading && state.entries.length > 0 && (
          <div>
            <CustomTable<RosterEntryT> data={state.entries} columns={cols} isLoading={false} emptyMessage="No hay estudiantes en esta sección" className={tableClassname} loadingMessage="" />
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-400">
              <span>{state.entries.length} estudiante(s)</span>
              <span>{state.entries.filter((e) => e.numericScore !== null).length} calificado(s)</span>
            </div>
          </div>
        )}
        {!state.loading && state.entries.length === 0 && (teacherSubjectSectionId && evaluativeActivityId) && <div className="py-16 text-center text-sm text-slate-400">Seleccione una sección y actividad, luego presione "Cargar".</div>}
      </div>
    </div>
  );
}
