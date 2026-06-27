import { useEffect, useReducer } from "react";
import { enrollmentService } from "@features/students/enrollments/enrollments.service";
import { incidentTypeService } from "@features/behavior/incident-type/incident-type.service";
import { severityService } from "@features/behavior/severity/severity.service";
import { academicPeriodService } from "@features/academic/academic-period";

interface Option { label: string; value: string; }
interface State { options: Option[]; loading: boolean; }
type Action = { type: "loading" } | { type: "success"; options: Option[] } | { type: "error" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading": return { options: [], loading: true };
    case "success": return { options: action.options, loading: false };
    case "error": return { options: [], loading: false };
  }
}

function useOptions(loader: () => Promise<Option[]>, deps: unknown[] = []) {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    loader().then((items) => { if (!cancelled) dispatch({ type: "success", options: items }); }).catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

export const useEnrollmentOptions = () => {
  const { options, loading } = useOptions(() => enrollmentService.list({ page: 1, pageSize: 100 }).then((items) => items.map((i) => ({ label: i.student_name ?? `Matrícula ${i.id}`, value: String(i.id) }))));
  return { enrollmentOptions: options, loading };
};

export const useIncidentTypeOptions = () => {
  const { options, loading } = useOptions(() => incidentTypeService.list({ page: 1, pageSize: 100 }).then((items) => items.map((i) => ({ label: i.name, value: String(i.id) }))));
  return { incidentTypeOptions: options, loading };
};

export const useSeverityOptions = () => {
  const { options, loading } = useOptions(() => severityService.list({ page: 1, pageSize: 100 }).then((items) => items.map((i) => ({ label: i.name, value: String(i.id) }))));
  return { severityOptions: options, loading };
};

export const useAcademicPeriodOptions = () => {
  const { options, loading } = useOptions(() => academicPeriodService.list({ page: 1, pageSize: 100 }).then((result) => result.items.map((i) => ({ label: i.name, value: String(i.id) }))));
  return { academicPeriodOptions: options, loading };
};
