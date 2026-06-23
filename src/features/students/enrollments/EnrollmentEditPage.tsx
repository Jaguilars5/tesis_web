import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput, CustomSelect } from "@shared/components/Form";
import { enrollmentService } from "./enrollments.service";
import { sectionService } from "@features/institutions/section";
import type { EnrollmentT } from "./enrollments.types";

export default function EnrollmentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<EnrollmentT | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sectionOptions, setSectionOptions] = useState<{ label: string; value: string }[]>([]);
  const [form, setForm] = useState({ section: 0, enrollment_status: "ACT", is_repeat: false, student_condition: "", cellphone: "", email: "", observations: "", is_active: true });

  useEffect(() => {
    if (!id) return;
    let c = false;
    if (!c) Promise.all([
      enrollmentService.get(Number(id)),
      sectionService.list({ page: 1, pageSize: 100 }),
    ]).then(([enr, sections]) => {
      if (!c) { setEnrollment(enr); setForm({ section: enr.section, enrollment_status: enr.enrollment_status, is_repeat: enr.is_repeat, student_condition: enr.student_condition ?? "", cellphone: enr.cellphone ?? "", email: enr.email ?? "", observations: enr.observations ?? "", is_active: enr.is_active }); setSectionOptions(sections.filter((s) => s.is_active).map((s) => ({ label: s.parallel, value: String(s.id) }))); }
    }).catch((err) => { if (!c) setError(err instanceof Error ? err.message : "Error al cargar datos"); });
    return () => { c = true; };
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!id) return;
    setSaving(true); setError("");
    try {
      await enrollmentService.update({ id: Number(id), data: form });
      navigate("/enrollments");
    } catch (err) { setError(err instanceof Error ? err.message : "Error al guardar"); }
    finally { setSaving(false); }
  }, [id, form, navigate]);

  if (!enrollment) return (<div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-primary" /></div>);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => navigate("/enrollments")} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><ArrowLeft className="size-5" /></button>
        <div><h1 className="text-2xl font-extrabold text-slate-800">Editar Matrícula</h1><p className="text-sm text-slate-500">{enrollment?.student_name ?? "Cargando..."}</p></div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <CustomSelect label="Curso" name="section" value={String(form.section)} onChange={(o) => setForm((f) => ({ ...f, section: Number(o.value) }))} options={sectionOptions} className={selectClassname} />
          <CustomSelect label="Estado" name="enrollment_status" value={form.enrollment_status} onChange={(o) => setForm((f) => ({ ...f, enrollment_status: String(o.value) }))} options={[{ label: "Activo", value: "ACT" }, { label: "Retirado", value: "WITHDRAWN" }, { label: "Egresado", value: "GRADUATED" }]} className={selectClassname} />
          <CustomInput label="Teléfono" name="cellphone" value={form.cellphone} onChange={(e) => setForm((f) => ({ ...f, cellphone: e.target.value }))} type="text" className={inputClassname} />
          <CustomInput label="Correo Electrónico" name="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} type="email" className={inputClassname} />
          <CustomInput label="Observaciones" name="observations" value={form.observations} onChange={(e) => setForm((f) => ({ ...f, observations: e.target.value }))} type="text" className={inputClassname} />
          <CustomCheckbox name="is_repeat" checked={form.is_repeat} onChange={(e) => setForm((f) => ({ ...f, is_repeat: e.target.checked }))} label="Estudiante repite el año" className={checkboxClassname} />
          <CustomCheckbox name="is_active" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} label="Activo" className={checkboxClassname} />
        </div>
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={() => navigate("/enrollments")} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</button>
          <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60">{saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{saving ? "Guardando..." : "Guardar Cambios"}</button>
        </div>
      </div>
    </div>
  );
}
