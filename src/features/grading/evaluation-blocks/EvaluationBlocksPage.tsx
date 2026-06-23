import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput, CustomSelect } from "@shared/components/Form";
import { useFormik } from "formik";
import { useEffect } from "react";

import { evaluationBlockSchema } from "./evaluation-blocks.utils";
import { useAcademicPeriodOptions } from "./evaluation-blocks.options";
import { useEvaluationBlockController, useEvaluationBlockForm } from "./evaluation-blocks.controller";
import { EvaluationBlockDeleteModal } from "./components/EvaluationBlockDeleteModal";
import { EvaluationBlockViewModal } from "./components/EvaluationBlockViewModal";
import { EvaluationBlockTable } from "./components/EvaluationBlockTable";

import type { SubmitErrorState } from "./evaluation-blocks.controller";
import type { EvaluationBlockFormValues, EvaluationBlockT } from "./evaluation-blocks.types";

const getFieldLabel = (f: string): string => ({ code: "Código", name: "Nombre", weight_percentage: "Porcentaje", academic_period: "Período", tipo: "Tipo", non_field_errors: "Error general" }[f] || f);

function FormModal({ isOpen, onClose, isEdit, editingEvaluationBlock, onSubmit, submitErrors, academicPeriodOptions }: {
  isOpen: boolean; onClose: () => void; isEdit: boolean; editingEvaluationBlock: EvaluationBlockT | null;
  onSubmit: (v: EvaluationBlockFormValues) => Promise<void>; submitErrors: SubmitErrorState;
  academicPeriodOptions: { label: string; value: string }[];
}) {
  const formik = useFormik<EvaluationBlockFormValues>({
    initialValues: editingEvaluationBlock
      ? { code: editingEvaluationBlock.code, name: editingEvaluationBlock.name, weight_percentage: editingEvaluationBlock.weight_percentage, academic_period: editingEvaluationBlock.academic_period, tipo: editingEvaluationBlock.tipo ?? "", is_active: editingEvaluationBlock.is_active }
      : { code: "", name: "", weight_percentage: 0, academic_period: 0, tipo: null, is_active: true },
    validationSchema: evaluationBlockSchema, enableReinitialize: true, onSubmit,
  });
  useEffect(() => { if (isOpen && editingEvaluationBlock) formik.setValues({ code: editingEvaluationBlock.code, name: editingEvaluationBlock.name, weight_percentage: editingEvaluationBlock.weight_percentage, academic_period: editingEvaluationBlock.academic_period, tipo: editingEvaluationBlock.tipo ?? "", is_active: editingEvaluationBlock.is_active }); }, [isOpen, editingEvaluationBlock]);
  if (!isOpen) return null;
  return (<div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/40" onClick={onClose} /><div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h3 className="text-lg font-semibold text-slate-900">{isEdit ? "Editar" : "Nuevo"} Bloque</h3><p className="mt-0.5 text-sm text-slate-500">Configure el bloque de evaluación</p></div><button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
    {(submitErrors.general.length > 0 || Object.keys(submitErrors.validation).length > 0) && (<div className="mx-5 mt-3 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm"><div className="flex items-start gap-2"><svg className="mt-0.5 size-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg><div className="flex-1"><p className="mb-2 text-sm font-semibold text-red-800">Error al guardar</p>{submitErrors.general.length > 0 && (<ul>{submitErrors.general.map((err, i) => (<li key={i} className="text-sm text-red-700">• {err}</li>))}</ul>)}{Object.keys(submitErrors.validation).length > 0 && (<ul>{Object.entries(submitErrors.validation).map(([f, m]) => (<li key={f} className="text-sm text-red-700"><span className="font-semibold">{getFieldLabel(f)}:</span> {m}</li>))}</ul>)}</div></div></div>)}
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-5"><CustomInput label="Nombre" name="name" placeholder="Nombre del bloque" value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" error={formik.touched.name ? formik.errors.name : undefined} className={inputClassname} /><CustomInput label="Porcentaje (%)" name="weight_percentage" type="number" value={String(formik.values.weight_percentage)} onBlur={formik.handleBlur} onChange={(e) => formik.setFieldValue("weight_percentage", Number(e.target.value))} error={formik.touched.weight_percentage ? formik.errors.weight_percentage : undefined} className={inputClassname} /><CustomSelect label="Período Académico" name="academic_period" options={academicPeriodOptions} value={formik.values.academic_period} onChange={(option) => formik.setFieldValue("academic_period", Number(option.value))} onBlur={formik.handleBlur} error={formik.touched.academic_period ? formik.errors.academic_period : undefined} className={selectClassname} placeholder="Seleccione un período" /><CustomInput label="Tipo" name="tipo" placeholder="FORMATIVA, SUMATIVA..." value={formik.values.tipo ?? ""} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" error={formik.touched.tipo ? formik.errors.tipo : undefined} className={inputClassname} />{isEdit && <CustomCheckbox name="is_active" checked={formik.values.is_active} onChange={formik.handleChange} onBlur={formik.handleBlur} label="Activo" className={checkboxClassname} />}<div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</button><button type="submit" disabled={formik.isSubmitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60">{formik.isSubmitting ? "Guardando..." : "Guardar"}</button></div></form></div></div>);
}

export default function EvaluationBlocksPage() {
  const { evaluationBlocks, isLoading, loadEvaluationBlocks, createEvaluationBlock, updateEvaluationBlock, deleteEvaluationBlock } = useEvaluationBlockController();
  const { isOpen, isEdit, editingEvaluationBlock, submitErrors, openModal, closeModal, handleSubmit } = useEvaluationBlockForm({ create: createEvaluationBlock, update: updateEvaluationBlock });
  const { academicPeriodOptions } = useAcademicPeriodOptions();
  const [viewing, setViewing] = useState<EvaluationBlockT | null>(null); const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<EvaluationBlockT | null>(null); const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openV = useCallback((eb: EvaluationBlockT) => { setViewing(eb); setIsViewOpen(true); }, []); const closeV = useCallback(() => { setViewing(null); setIsViewOpen(false); }, []);
  const openD = useCallback((eb: EvaluationBlockT) => { setDeleting(eb); setIsDeleteOpen(true); }, []); const closeD = useCallback(() => { setDeleting(null); setIsDeleteOpen(false); }, []);
  const handleDel = useCallback(async (id: number) => { await deleteEvaluationBlock(id); }, [deleteEvaluationBlock]);

  return (<div className="space-y-4"><div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-extrabold text-slate-800">Bloques de Evaluación</h1><p className="mt-1 text-sm text-slate-500">Gestiona los bloques de evaluación</p></div><button type="button" onClick={() => openModal()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"><Plus className="size-4" />Nuevo Bloque</button></div>
    <EvaluationBlockTable evaluationBlocks={evaluationBlocks} isLoading={isLoading} loadEvaluationBlocks={loadEvaluationBlocks} onEdit={openModal} onView={openV} onDelete={openD} />
    <FormModal isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editingEvaluationBlock={editingEvaluationBlock} onSubmit={handleSubmit} submitErrors={submitErrors} academicPeriodOptions={academicPeriodOptions} />
    <EvaluationBlockViewModal isOpen={isViewOpen} evaluationBlockId={viewing?.id ?? null} onClose={closeV} />
    <EvaluationBlockDeleteModal isOpen={isDeleteOpen} evaluationBlock={deleting} onClose={closeD} onConfirm={handleDel} /></div>);
}
