import { ArrowLeft, ArrowRight, Check, GraduationCap, Loader2, School, Search, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@shared/components/Badge";
import { CustomSelect } from "@shared/components/Form";
import { selectClassname } from "@app/styles/styles";
import { enrollmentService } from "./enrollments.service";
import { studentService } from "@features/students/student";
import { sectionService } from "@features/institutions/section";
import { academicPeriodService } from "@features/academic/academic-period";
import type { StudentT } from "@features/students/student/student.types";
import type { SectionT } from "@features/institutions/section/section.types";

interface Step1State { searchTerm: string; results: StudentT[]; loading: boolean; selected: StudentT | null; }
type Step1Action = { type: "SEARCH"; term: string } | { type: "RESULTS"; results: StudentT[] } | { type: "LOADING" } | { type: "SELECT"; student: StudentT } | { type: "CLEAR" };

function step1Reducer(s: Step1State, a: Step1Action): Step1State {
  switch (a.type) {
    case "SEARCH": return { ...s, searchTerm: a.term, selected: null };
    case "LOADING": return { ...s, loading: true };
    case "RESULTS": return { ...s, results: a.results, loading: false };
    case "SELECT": return { ...s, selected: a.student };
    case "CLEAR": return { searchTerm: "", results: [], loading: false, selected: null };
    default: return s;
  }
}

export default function EnrollmentWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [step1, dispatch1] = useReducer(step1Reducer, { searchTerm: "", results: [], loading: false, selected: null });
  const [sections, setSections] = useState<SectionT[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number>(0);
  const [academicPeriods, setAcademicPeriods] = useState<{ label: string; value: string }[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(0);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    sectionService.list({ page: 1, pageSize: 100 }).then(setSections).catch(() => {});
    academicPeriodService.list({ page: 1, pageSize: 100 }).then(({ items }) => {
      setAcademicPeriods(items.map((p) => ({ label: `${p.name} (${p.code})`, value: String(p.id) })));
      if (items.length > 0) setSelectedPeriodId(items[0].id);
    }).catch(() => {});
  }, []);

  const searchStudents = useCallback(async (term: string) => {
    if (term.length < 2) { dispatch1({ type: "RESULTS", results: [] }); return; }
    dispatch1({ type: "LOADING" });
    try {
      const results = await studentService.list({ search: term, page: 1, pageSize: 20 });
      dispatch1({ type: "RESULTS", results });
    } catch { dispatch1({ type: "RESULTS", results: [] }); }
  }, []);

  useEffect(() => {
    if (step1.searchTerm.length >= 2) { const t = setTimeout(() => searchStudents(step1.searchTerm), 400); return () => clearTimeout(t); }
    dispatch1({ type: "RESULTS", results: [] });
  }, [step1.searchTerm, searchStudents]);

  const handleCreate = async () => {
    if (!step1.selected || !selectedSectionId) return;
    setEnrolling(true); setError("");
    try {
      await enrollmentService.create({
        student: step1.selected.id,
        section: selectedSectionId,
        enrollment_status: "ACT",
        enrollment_date: new Date().toISOString().split("T")[0],
        is_repeat: false,
        student_condition: "",
        cellphone: "",
        email: "",
        observations: "",
        attendance_rate: null,
        withdrawal_date: null,
      });
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al crear la matrícula"); }
    finally { setEnrolling(false); }
  };

  if (success) {
    return (<div className="mx-auto mt-10 max-w-lg space-y-6 text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check className="size-8" /></span><h1 className="text-2xl font-extrabold text-slate-800">Matrícula Creada</h1><p className="text-sm text-slate-500">La matrícula se ha creado exitosamente.</p><button type="button" onClick={() => navigate("/enrollments")} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-hover">Ir a Matrículas</button></div>);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Nueva Matrícula</h1>
          <p className="mt-1 text-sm text-slate-500">Asistente paso a paso para matricular un estudiante</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (<div key={s} className="flex items-center gap-2"><span className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${step === s ? "bg-primary text-white" : step > s ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{step > s ? <Check className="size-4" /> : s}</span><span className={`text-sm font-medium ${step >= s ? "text-slate-800" : "text-slate-400"}`}>{s === 1 ? "Estudiante" : s === 2 ? "Curso" : "Confirmar"}</span>{s < 3 && <div className="mx-1 h-px w-8 bg-slate-200" />}</div>))}
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {step === 1 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Buscar Estudiante</h2>
          <p className="mt-1 text-sm text-slate-500">Busque por nombre, apellido o código del estudiante</p>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input type="text" value={step1.searchTerm} onChange={(e) => dispatch1({ type: "SEARCH", term: e.target.value })} placeholder="Buscar estudiante..." className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          {step1.loading && <div className="mt-4 flex items-center justify-center py-8"><Loader2 className="size-5 animate-spin text-slate-400" /></div>}
          {!step1.loading && step1.results.length > 0 && (
            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {step1.results.map((s) => (<button type="button" key={s.id} onClick={() => dispatch1({ type: "SELECT", student: s })} className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition ${step1.selected?.id === s.id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"}`}><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"><UserPlus className="size-5" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{s.full_name}</p><p className="text-xs text-slate-400">{s.student_code ? `Código: ${s.student_code}` : "Sin código"}</p></div>{s.is_active ? <Badge variant="default">Activo</Badge> : <Badge variant="outline">Inactivo</Badge>}</button>))}
            </div>
          )}
          {!step1.loading && step1.searchTerm.length >= 2 && step1.results.length === 0 && <div className="mt-4 py-8 text-center text-sm text-slate-400">No se encontraron estudiantes con ese criterio.</div>}
          {step1.selected && (<div className="mt-6 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4"><div><p className="text-sm font-semibold text-emerald-900">{step1.selected.full_name}</p><p className="text-xs text-emerald-600">Estudiante seleccionado</p></div><button type="button" onClick={() => dispatch1({ type: "CLEAR" })} className="text-xs text-red-500 hover:underline">Cambiar</button></div>)}
          <div className="mt-6 flex justify-end"><button type="button" disabled={!step1.selected} onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60">Continuar <ArrowRight className="size-4" /></button></div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3"><Users className="size-5 text-slate-400" /><span className="text-sm text-slate-600">Estudiante: <strong>{step1.selected?.full_name}</strong></span></div>
          <h2 className="text-lg font-semibold text-slate-900">Seleccionar Curso y Período</h2>
          <p className="mt-1 text-sm text-slate-500">Elija el curso al que se matriculará el estudiante</p>
          <div className="mt-4 space-y-4">
            <CustomSelect label="Curso" name="section" placeholder="Seleccione un curso..." value={selectedSectionId ? String(selectedSectionId) : ""} onChange={(o) => setSelectedSectionId(Number(o.value))} options={sections.filter((s) => s.is_active).map((s) => ({ label: `${s.parallel} (${s.academic_grade_name ?? ""})`, value: String(s.id) }))} className={selectClassname} />
            <CustomSelect label="Período Académico" name="academic_period" placeholder="Seleccione un período..." value={selectedPeriodId ? String(selectedPeriodId) : ""} onChange={(o) => setSelectedPeriodId(Number(o.value))} options={academicPeriods} className={selectClassname} />
          </div>
          <div className="mt-6 flex items-center justify-between"><button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft className="size-4" />Atrás</button><button type="button" disabled={!selectedSectionId} onClick={() => setStep(3)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60">Continuar <ArrowRight className="size-4" /></button></div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Confirmar Matrícula</h2>
          <p className="mt-1 text-sm text-slate-500">Revise los datos antes de crear la matrícula</p>
          <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3"><GraduationCap className="size-5 text-slate-400" /><div><p className="text-sm font-medium text-slate-900">Estudiante</p><p className="text-xs text-slate-500">{step1.selected?.full_name}</p></div></div>
            <div className="flex items-center gap-3"><School className="size-5 text-slate-400" /><div><p className="text-sm font-medium text-slate-900">Curso</p>        <p className="text-xs text-slate-500">{sections.find((s) => s.id === selectedSectionId)?.parallel ?? "—"}</p></div></div>
          </div>
          <div className="mt-6 flex items-center justify-between"><button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft className="size-4" />Atrás</button><button type="button" onClick={handleCreate} disabled={enrolling} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">{enrolling ? <Loader2 className="size-4 animate-spin" /> : <GraduationCap className="size-4" />}{enrolling ? "Matriculando..." : "Confirmar Matrícula"}</button></div>
        </div>
      )}
    </div>
  );
}
