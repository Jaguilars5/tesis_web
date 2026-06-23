import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { behaviorEvaluationService } from "./behavior-evaluation.service";
import { loadPending, loadSuccess, loadError, currentEvaluationLoaded, evaluationUpdated, evaluationCalculated, mutationError, selectBehaviorEvaluations, selectBehaviorEvaluationStatus, selectBehaviorEvaluationError, selectCurrentBehaviorEvaluation } from "./behavior-evaluation.slice";
import type { BehaviorEvaluationCalculateDataT, BehaviorEvaluationFormValues, BehaviorEvaluationListParamsT, BehaviorEvaluationT, BehaviorEvaluationUpdateParamsT } from "./behavior-evaluation.types";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null; };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useBehaviorEvaluationController = () => {
  const dispatch = useAppDispatch();
  const behaviorEvaluations = useAppSelector(selectBehaviorEvaluations);
  const currentBehaviorEvaluation = useAppSelector(selectCurrentBehaviorEvaluation);
  const status = useAppSelector(selectBehaviorEvaluationStatus);
  const error = useAppSelector(selectBehaviorEvaluationError);

  const loadBehaviorEvaluations = useCallback(async (params?: BehaviorEvaluationListParamsT) => {
    dispatch(loadPending());
    try { const items = await behaviorEvaluationService.list(params ?? { page: 1, pageSize: 100 }); dispatch(loadSuccess(items)); }
    catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error al cargar evaluaciones")); }
  }, [dispatch]);

  const loadBehaviorEvaluation = useCallback(async (id: number) => {
    try { const item = await behaviorEvaluationService.get(id); dispatch(currentEvaluationLoaded(item)); }
    catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error al cargar evaluación")); }
  }, [dispatch]);

  const update = useCallback(async (params: BehaviorEvaluationUpdateParamsT): Promise<BehaviorEvaluationT> => {
    try { const updated = await behaviorEvaluationService.update(params); dispatch(evaluationUpdated(updated)); return updated; }
    catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  const calculate = useCallback(async (data: BehaviorEvaluationCalculateDataT): Promise<BehaviorEvaluationT> => {
    try { const result = await behaviorEvaluationService.calculate(data); dispatch(evaluationCalculated(result)); return result; }
    catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  return { behaviorEvaluations, currentBehaviorEvaluation, isLoading: status === "loading", error, loadBehaviorEvaluations, loadBehaviorEvaluation, updateBehaviorEvaluation: update, calculateBehaviorEvaluation: calculate };
};

export type BehaviorEvaluationControllerT = ReturnType<typeof useBehaviorEvaluationController>;

const extractError = (error: unknown) => {
  if (error && typeof error === "object" && "msg" in error && typeof (error as { msg?: unknown }).msg === "string") {
    const obj = error as CreateRejectValue;
    const fieldErrors: ValidationErrors = {}; const general: string[] = [];
    if (obj.data && typeof obj.data === "object") { for (const [key, value] of Object.entries(obj.data)) { if (typeof value === "string") fieldErrors[key] = value; else general.push(`${key}: ${value}`); } }
    if (general.length === 0 && Object.keys(fieldErrors).length === 0) general.push(obj.msg);
    return { msg: obj.msg, general, validation: fieldErrors };
  }
  const msg = error instanceof Error ? error.message : "Error desconocido";
  return { msg, general: [msg], validation: {} };
};

const unwrapUpdate = async (params: BehaviorEvaluationUpdateParamsT, update: BehaviorEvaluationControllerT["updateBehaviorEvaluation"]) => {
  try { return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

interface UseFormArgs { update: BehaviorEvaluationControllerT["updateBehaviorEvaluation"]; }

export const useBehaviorEvaluationForm = ({ update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<BehaviorEvaluationT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });

  const openModal = useCallback((evaluation?: BehaviorEvaluationT) => { setEditingEvaluation(evaluation ?? null); setSubmitErrors({ general: [], validation: {} }); setIsOpen(true); }, []);
  const closeModal = useCallback(() => { setIsOpen(false); setEditingEvaluation(null); setSubmitErrors({ general: [], validation: {} }); }, []);

  const handleSubmit = useCallback(async (values: BehaviorEvaluationFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (!editingEvaluation) return;
    const { final_scale, override_reason, general_observation } = values;
    const result = await unwrapUpdate({ id: editingEvaluation.id, data: { final_scale, override_reason, general_observation } }, update);
    if (result.ok) { closeModal(); return; }
    setSubmitErrors(result.errors);
  }, [editingEvaluation, update, closeModal]);

  return { isOpen, editingEvaluation, submitErrors, openModal, closeModal, handleSubmit };
};
