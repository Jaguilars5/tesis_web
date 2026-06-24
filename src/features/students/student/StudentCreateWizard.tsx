import { ArrowLeft, ArrowRight, Check, Loader2, Search, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@shared/components/Badge";
import { CustomInput, CustomSelect, CustomCheckbox } from "@shared/components/Form";
import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { studentService } from "./student.service";
import { useSpecialNeedsTypeOptions, useKinshipOptions } from "@features/students";
import type { RepresentativeT } from "@features/students/representative/representative.types";
import { representativeService } from "@features/students/representative";
import type { StudentT } from "./student.types";

interface RepresentativeFormData {
  dni: string;
  names: string;
  last_names: string;
  email: string;
  phone: string;
  address: string;
  city: number | null;
  document_type: string;
}

type RepMode = "select" | "create";

export default function StudentCreateWizardPage() {
  const navigate = useNavigate();

  // Step 1 – Student data
  const [step, setStep] = useState(1);
  const [studentForm, setStudentForm] = useState({
    document_number: "", names: "", last_names: "", birth_date: "", email: "", phone: "",
    has_special_needs: false, special_needs_type: null as number | null,
  });
  type StudentFormKey = keyof typeof studentForm;
  const [step1Errors, setStep1Errors] = useState<Partial<Record<StudentFormKey, string>>>({});

  // Step 2 – Representative
  const [repMode, setRepMode] = useState<RepMode>("select");
  const [repSearch, setRepSearch] = useState("");
  const [repResults, setRepResults] = useState<RepresentativeT[]>([]);
  const [repLoading, setRepLoading] = useState(false);
  const [selectedRep, setSelectedRep] = useState<RepresentativeT | null>(null);
  const [kinship, setKinship] = useState("");
  const [step2Errors, setStep2Errors] = useState<Partial<Record<string, string>>>({});

  // Representative create form
  const [repForm, setRepForm] = useState<RepresentativeFormData>({
    dni: "", names: "", last_names: "", email: "", phone: "", address: "",
    city: null as number | null, document_type: "",
  });

  // Hooks for catalog options
  const { specialNeedsTypeOptions } = useSpecialNeedsTypeOptions();
  const { kinshipOptions } = useKinshipOptions();

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdStudent, setCreatedStudent] = useState<StudentT | null>(null);
  const [createdRepName, setCreatedRepName] = useState("");

  // Search representatives with debounce
  const searchReps = useCallback(async (term: string) => {
    if (term.length < 2) { setRepResults([]); return; }
    setRepLoading(true);
    try {
      const items = await representativeService.list({ search: term, page: 1, pageSize: 20 });
      setRepResults(items);
    } catch { setRepResults([]); }
    finally { setRepLoading(false); }
  }, []);

  useEffect(() => {
    if (repSearch.length >= 2) {
      const t = setTimeout(() => searchReps(repSearch), 400);
      return () => clearTimeout(t);
    }
  }, [repSearch, searchReps]);

  // Validate step 1
  const validateStep1 = (): boolean => {
    const errs: Partial<Record<StudentFormKey, string>> = {};
    if (!studentForm.document_number.trim()) errs.document_number = "El N° Documento es obligatorio";
    if (!studentForm.names.trim()) errs.names = "Los nombres son obligatorios";
    if (!studentForm.last_names.trim()) errs.last_names = "Los apellidos son obligatorios";
    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate step 2
  const validateStep2 = (): boolean => {
    const errs: Partial<Record<string, string>> = {};
    if (!kinship) errs.kinship = "El parentesco es obligatorio";
    if (repMode === "create") {
      if (!repForm.dni.trim()) errs.dni = "El DNI es obligatorio";
      if (!repForm.names.trim()) errs.names = "Los nombres son obligatorios";
      if (!repForm.last_names.trim()) errs.last_names = "Los apellidos son obligatorios";
    } else {
      if (!selectedRep) errs.selectedRep = "Debe seleccionar un representante";
    }
    setStep2Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    setError("");
    try {
      const student = await studentService.create({
        document_number: studentForm.document_number,
        names: studentForm.names,
        last_names: studentForm.last_names,
        birth_date: studentForm.birth_date || undefined,
        email: studentForm.email || undefined,
        phone: studentForm.phone || undefined,
        has_special_needs: studentForm.has_special_needs || undefined,
        special_needs_type: studentForm.special_needs_type ?? undefined,
      });
      setCreatedStudent(student);

      if (repMode === "create") {
        const result = await studentService.assignRepresentative(student.id, {
          document_number: repForm.dni,
          names: repForm.names,
          last_names: repForm.last_names,
          email: repForm.email || undefined,
          phone: repForm.phone || undefined,
          kinship,
        }) as { user_names?: string };
        setCreatedRepName(result?.user_names ?? `${repForm.names} ${repForm.last_names}`);
      } else if (selectedRep) {
        const result = await studentService.assignRepresentative(student.id, {
          user_id: selectedRep.user ?? undefined,
          kinship,
        }) as { user_names?: string };
        setCreatedRepName(result?.user_names ?? `${selectedRep.names} ${selectedRep.last_names}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el estudiante");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: StudentFormKey, value: string | boolean | number | null) => {
    setStudentForm((prev) => ({ ...prev, [field]: value }));
    if (step1Errors[field as keyof typeof step1Errors]) setStep1Errors((prev) => { const n = { ...prev }; delete n[field as keyof typeof prev]; return n; });
  };

  if (createdStudent) {
    return (
      <div className="mx-auto mt-10 max-w-lg space-y-6 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="size-8" />
        </span>
        <h1 className="text-2xl font-extrabold text-slate-800">Estudiante Creado</h1>
        <p className="text-sm text-slate-500">
          Se ha creado el estudiante <strong>{createdStudent.full_name}</strong>
          {createdRepName && <> y se ha asignado el representante <strong>{createdRepName}</strong></>}.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button type="button" onClick={() => navigate("/students")}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Ir a Estudiantes
          </button>
          <button type="button" onClick={() => window.location.reload()}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-hover">
            Nuevo Estudiante
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Nuevo Estudiante</h1>
          <p className="mt-1 text-sm text-slate-500">Asistente paso a paso para registrar un estudiante</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
              step === s ? "bg-primary text-white" : step > s ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
            }`}>
              {step > s ? <Check className="size-4" /> : s}
            </span>
            <span className={`text-sm font-medium ${step >= s ? "text-slate-800" : "text-slate-400"}`}>
              {s === 1 ? "Datos del Estudiante" : "Representante"}
            </span>
            {s < 2 && <div className="mx-1 h-px w-8 bg-slate-200" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {/* Step 1: Student data */}
      {step === 1 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Datos del Estudiante</h2>
          <p className="mt-1 text-sm text-slate-500">Complete la información personal del estudiante</p>
          <div className="mt-4 space-y-4">
            <CustomInput label="N° Documento *" name="document_number"
              value={studentForm.document_number}
              onChange={(e) => updateField("document_number", e.target.value)}
              type="text" className={inputClassname}
              error={step1Errors.document_number} />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput label="Nombres *" name="names"
                value={studentForm.names}
                onChange={(e) => updateField("names", e.target.value)}
                type="text" className={inputClassname}
                error={step1Errors.names} />
              <CustomInput label="Apellidos *" name="last_names"
                value={studentForm.last_names}
                onChange={(e) => updateField("last_names", e.target.value)}
                type="text" className={inputClassname}
                error={step1Errors.last_names} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput label="Email" name="email"
                value={studentForm.email}
                onChange={(e) => updateField("email", e.target.value)}
                type="email" className={inputClassname} />
              <CustomInput label="Teléfono" name="phone"
                value={studentForm.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                type="text" className={inputClassname} />
            </div>
            <CustomInput label="Fecha de Nacimiento" name="birth_date"
              value={studentForm.birth_date}
              onChange={(e) => updateField("birth_date", e.target.value)}
              type="date" className={inputClassname} />
            <CustomCheckbox
              name="has_special_needs"
              checked={studentForm.has_special_needs}
              onChange={(e) => updateField("has_special_needs", e.target.checked)}
              label="Tiene Necesidades Educativas Especiales (NEE)"
              className={checkboxClassname}
            />
            {studentForm.has_special_needs && (
              <CustomSelect
                label="Tipo de NEE"
                name="special_needs_type"
                placeholder="Seleccione un tipo..."
                value={String(studentForm.special_needs_type ?? "")}
                options={specialNeedsTypeOptions}
                onChange={(o) => updateField("special_needs_type", o.value ? Number(o.value) : null)}
                className={selectClassname}
              />
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={() => { if (validateStep1()) setStep(2); }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-hover">
              Continuar <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Representative */}
      {step === 2 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Representante</h2>
              <p className="mt-1 text-sm text-slate-500">Seleccione un representante existente o cree uno nuevo</p>
            </div>
            <button type="button" onClick={() => {
              setRepMode(repMode === "select" ? "create" : "select");
              setSelectedRep(null);
            }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {repMode === "select" ? "Crear Nuevo" : "Buscar Existente"}
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <CustomSelect
              label="Parentesco *"
              name="kinship"
              placeholder="Seleccione parentesco..."
              value={kinship}
              options={kinshipOptions}
              onChange={(o) => setKinship(String(o.value))}
              className={selectClassname}
              error={step2Errors.kinship}
            />

            {repMode === "select" ? (
              <>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={repSearch}
                    onChange={(e) => setRepSearch(e.target.value)}
                    placeholder="Buscar representante por nombre o DNI..."
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {repLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-slate-400" />
                  </div>
                )}
                {repSearch.length < 2 && !selectedRep && (
                  <div className="py-8 text-center text-sm text-slate-400">
                    Escriba al menos 2 caracteres para buscar representantes existentes, o haga clic en "Crear Nuevo" arriba.
                  </div>
                )}
                {!repLoading && repResults.length > 0 && (
                  <div className="max-h-72 space-y-2 overflow-y-auto">
                    {repResults.map((r) => (
                      <button type="button" key={r.id}
                        onClick={() => setSelectedRep(r)}
                        className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition ${
                          selectedRep?.id === r.id
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <Users className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {r.names} {r.last_names}
                          </p>
                          <p className="text-xs text-slate-400">
                            {r.dni ? `DNI: ${r.dni}` : ""}
                            {r.dni && r.email ? " | " : ""}
                            {r.email ? r.email : ""}
                          </p>
                        </div>
                        {r.is_active ? <Badge variant="default">Activo</Badge> : <Badge variant="outline">Inactivo</Badge>}
                      </button>
                    ))}
                  </div>
                )}
                {!repLoading && repSearch.length >= 2 && repResults.length === 0 && (
                  <div className="py-8 text-center text-sm text-slate-400">
                    No se encontraron representantes.{" "}
                    <button type="button" onClick={() => setRepMode("create")}
                      className="font-medium text-primary hover:underline">
                      Crear uno nuevo
                    </button>
                  </div>
                )}
                {selectedRep && (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        {selectedRep.names} {selectedRep.last_names}
                      </p>
                      <p className="text-xs text-emerald-600">Representante seleccionado</p>
                    </div>
                    <button type="button" onClick={() => setSelectedRep(null)}
                      className="text-xs text-red-500 hover:underline">Cambiar</button>
                  </div>
                )}
                {step2Errors.selectedRep && (
                  <p className="text-xs text-red-500">{step2Errors.selectedRep}</p>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput label="DNI *" name="rep_dni"
                    value={repForm.dni}
                    onChange={(e) => setRepForm((p) => ({ ...p, dni: e.target.value }))}
                    type="text" className={inputClassname}
                    error={step2Errors.dni} />
                  <CustomInput label="Tipo Documento" name="rep_document_type"
                    value={repForm.document_type}
                    onChange={(e) => setRepForm((p) => ({ ...p, document_type: e.target.value }))}
                    type="text" className={inputClassname} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput label="Nombres *" name="rep_names"
                    value={repForm.names}
                    onChange={(e) => setRepForm((p) => ({ ...p, names: e.target.value }))}
                    type="text" className={inputClassname}
                    error={step2Errors.names} />
                  <CustomInput label="Apellidos *" name="rep_last_names"
                    value={repForm.last_names}
                    onChange={(e) => setRepForm((p) => ({ ...p, last_names: e.target.value }))}
                    type="text" className={inputClassname}
                    error={step2Errors.last_names} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput label="Email" name="rep_email"
                    value={repForm.email}
                    onChange={(e) => setRepForm((p) => ({ ...p, email: e.target.value }))}
                    type="email" className={inputClassname} />
                  <CustomInput label="Teléfono" name="rep_phone"
                    value={repForm.phone}
                    onChange={(e) => setRepForm((p) => ({ ...p, phone: e.target.value }))}
                    type="text" className={inputClassname} />
                </div>
                <CustomInput label="Dirección" name="rep_address"
                  value={repForm.address}
                  onChange={(e) => setRepForm((p) => ({ ...p, address: e.target.value }))}
                  type="text" className={inputClassname} />
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <ArrowLeft className="size-4" />Atrás
            </button>
            <button type="button" onClick={handleCreate} disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
              {submitting ? "Creando..." : "Crear Estudiante"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
