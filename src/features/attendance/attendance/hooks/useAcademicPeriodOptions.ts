import { useEffect, useReducer } from "react";
import { useAppSelector } from "@shared/redux/hooks";
import { selectAuthUser } from "@features/auth/auth.slice";
import { UserRoleEnum } from "@features/auth";
import { academicPeriodService } from "@features/academic/academic-period";

export interface AcademicPeriodOption {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

interface State { options: AcademicPeriodOption[]; loading: boolean; }
type Action = { type: "loading" } | { type: "success"; options: AcademicPeriodOption[] } | { type: "error" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading": return { options: [], loading: true };
    case "success": return { options: action.options, loading: false };
    case "error": return { options: [], loading: false };
  }
}

export const useAcademicPeriodOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });
  const user = useAppSelector(selectAuthUser);
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    academicPeriodService.list({ page: 1, pageSize: 100 })
      .then(({ items }) => {
        let filtered = items;
        if (user?.role === UserRoleEnum.TEACHER) filtered = items.filter((i) => i.is_active);
        if (!cancelled) dispatch({ type: "success", options: filtered.map((i) => ({ label: i.name, value: String(i.id), startDate: i.start_date, endDate: i.end_date })) });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "error" }); });
    return () => { cancelled = true; };
  }, [user]);
  return { academicPeriodOptions: state.options, loading: state.loading };
};
