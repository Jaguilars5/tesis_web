import { qualitativeScaleService } from "@features/grading/qualitative-scales/qualitative-scales.service";
import { academicSubLevelService } from "@features/institutions/academic-sublevel/academic-sublevel.service";
import { useEffect, useReducer } from "react";

interface Option {
  label: string;
  value: string;
}

interface State {
  scaleOptions: Option[];
  sublevelOptions: Option[];
  loading: boolean;
}

type Action =
  | { type: "loading" }
  | { type: "success"; scales: Option[]; sublevels: Option[] }
  | { type: "error" };

function optionsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "success":
      return { ...state, loading: false, scaleOptions: action.scales, sublevelOptions: action.sublevels };
    case "error":
      return { ...state, loading: false };
  }
}

export const useQualitativeScaleSublevelOptions = () => {
  const [state, dispatch] = useReducer(optionsReducer, {
    scaleOptions: [],
    sublevelOptions: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });

    Promise.all([
      qualitativeScaleService.list({ page: 1, pageSize: 100 }),
      academicSubLevelService.list({ page: 1, pageSize: 100 }),
    ])
      .then(([{ items: scales }, sublevels]) => {
        if (cancelled) return;
        dispatch({
          type: "success",
          scales: scales
            .filter((item) => item.is_active)
            .map((item) => ({ label: item.name, value: String(item.id) })),
          sublevels: sublevels
            .filter((item) => item.is_active)
            .map((item) => ({ label: item.name, value: String(item.id) })),
        });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    scaleOptions: state.scaleOptions,
    sublevelOptions: state.sublevelOptions,
    loading: state.loading,
  };
};
