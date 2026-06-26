import { useEffect, useReducer } from "react";
import { attendanceStatusService } from "@features/attendance/attendance-status/attendance-status.service";

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

export const useAttendanceStatusOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    attendanceStatusService.list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) dispatch({ type: "success", options: items.map((i) => ({ label: i.name, value: String(i.id) })) });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, []);
  return { attendanceStatusOptions: state.options, loading: state.loading };
};
