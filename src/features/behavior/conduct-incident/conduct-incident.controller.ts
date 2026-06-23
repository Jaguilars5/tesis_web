import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { conductIncidentService } from "./conduct-incident.service";
import { loadPending, loadSuccess, loadError, currentLoaded, entityCreated, entityUpdated, mutationError, selectConductIncidents, selectConductIncidentsStatus, selectConductIncidentsError, selectCurrentConductIncident } from "./conduct-incident.slice";
import type { ConductIncidentCreateDataT, ConductIncidentCreateParamsT, ConductIncidentFormValues, ConductIncidentListParamsT, ConductIncidentT, ConductIncidentUpdateParamsT } from "./conduct-incident.types";

export type CreateRejectValue = { msg: string; data: Record<string, string> | null; };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

export const useConductIncidentController = () => {
  const dispatch = useAppDispatch();
  const conductIncidents = useAppSelector(selectConductIncidents);
  const currentConductIncident = useAppSelector(selectCurrentConductIncident);
  const status = useAppSelector(selectConductIncidentsStatus);
  const error = useAppSelector(selectConductIncidentsError);

  const loadConductIncidents = useCallback(async (params?: ConductIncidentListParamsT) => {
    dispatch(loadPending());
    try { const items = await conductIncidentService.list(params ?? { page: 1, pageSize: 100 }); dispatch(loadSuccess(items)); }
    catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error al cargar incidentes")); }
  }, [dispatch]);
  const loadConductIncident = useCallback(async (id: number) => {
    try { const item = await conductIncidentService.get(id); dispatch(currentLoaded(item)); }
    catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error al cargar incidente")); }
  }, [dispatch]);
  const create = useCallback(async (data: ConductIncidentCreateParamsT): Promise<ConductIncidentT> => {
    try { const created = await conductIncidentService.create(data); dispatch(entityCreated(created)); return created; }
    catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);
  const update = useCallback(async (params: ConductIncidentUpdateParamsT): Promise<ConductIncidentT> => {
    try { const updated = await conductIncidentService.update(params); dispatch(entityUpdated(updated)); return updated; }
    catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  return { conductIncidents, currentConductIncident, isLoading: status === "loading", error, loadConductIncidents, loadConductIncident, createConductIncident: create, updateConductIncident: update };
};

export type ConductIncidentControllerT = ReturnType<typeof useConductIncidentController>;

const extractError = (error: unknown) => {
  if (error && typeof error === "object" && "msg" in error && typeof (error as { msg?: unknown }).msg === "string") {
    const obj = error as CreateRejectValue; const fieldErrors: ValidationErrors = {}; const general: string[] = [];
    if (obj.data && typeof obj.data === "object") { for (const [key, value] of Object.entries(obj.data)) { if (typeof value === "string") fieldErrors[key] = value; else general.push(`${key}: ${value}`); } }
    if (general.length === 0 && Object.keys(fieldErrors).length === 0) general.push(obj.msg);
    return { msg: obj.msg, general, validation: fieldErrors };
  }
  const msg = error instanceof Error ? error.message : "Error desconocido";
  return { msg, general: [msg], validation: {} };
};

const unwrapCreate = async (data: ConductIncidentCreateDataT, create: ConductIncidentControllerT["createConductIncident"]) => {
  try { return { ok: true as const, result: await create(data), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

const unwrapUpdate = async (params: ConductIncidentUpdateParamsT, update: ConductIncidentControllerT["updateConductIncident"]) => {
  try { return { ok: true as const, result: await update(params), errors: { general: [], validation: {} } as SubmitErrorState }; }
  catch (error) { const parsed = extractError(error); return { ok: false as const, result: null, errors: { general: parsed.general, validation: parsed.validation } as SubmitErrorState }; }
};

interface UseFormArgs { create: ConductIncidentControllerT["createConductIncident"]; update: ConductIncidentControllerT["updateConductIncident"]; }

export const useConductIncidentForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<ConductIncidentT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });
  const isEdit = !!editingIncident;

  const openModal = useCallback((incident?: ConductIncidentT) => { setEditingIncident(incident ?? null); setSubmitErrors({ general: [], validation: {} }); setIsOpen(true); }, []);
  const closeModal = useCallback(() => { setIsOpen(false); setEditingIncident(null); setSubmitErrors({ general: [], validation: {} }); }, []);

  const handleSubmit = useCallback(async (values: ConductIncidentFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    const payload = { incident_type: values.incident_type!, severity: values.severity!, academic_period: values.academic_period!, enrollment: values.enrollment!, incident_date: values.incident_date, description: values.description, actions_taken: values.actions_taken, family_notified: values.family_notified };
    if (editingIncident) {
      const result = await unwrapUpdate({ id: editingIncident.id, data: payload }, update);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    } else {
      const result = await unwrapCreate(payload, create);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    }
  }, [editingIncident, create, update, closeModal]);

  return { isOpen, isEdit, editingIncident, submitErrors, openModal, closeModal, handleSubmit };
};
