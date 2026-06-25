import { useEffect, useReducer } from "react";

import { subjectOfferingService } from "@features/academic/subject-offering/subject-offering.service";

interface Option {
  label: string;
  value: string;
}

interface State {
  options: Option[];
  loading: boolean;
}

type Action =
  | { type: "loading" }
  | { type: "success"; options: Option[] }
  | { type: "error" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "success":
      return { options: action.options, loading: false };
    case "error":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export const useSubjectOfferingOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    subjectOfferingService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: items.map((i) => ({
              label: `${i.school_year_name} - ${i.section_name}`,
              value: String(i.id),
            })),
          });
        }
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { subjectOfferingOptions: state.options, loading: state.loading };
};
