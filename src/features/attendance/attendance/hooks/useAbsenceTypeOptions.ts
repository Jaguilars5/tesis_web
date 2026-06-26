import { useEffect, useReducer } from "react";
import { absenceTypeService } from "@features/attendance/absence-type/absence-type.service";

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

export const useAbsenceTypeOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    absenceTypeService.list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) dispatch({ type: "success", options: items.map((i) => ({ label: i.name, value: String(i.id) })) });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, []);
  return { absenceTypeOptions: state.options, loading: state.loading };
};
