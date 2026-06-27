import { periodTypeService } from "@features/academic/period-types/period-types.service";
import type { PeriodTypeT } from "@features/academic/period-types/period-types.types";
import { useEffect, useReducer } from "react";

interface Option {
  label: string;
  value: string;
}

const buildOptions = (items: PeriodTypeT[]): Option[] =>
  items.map((item) => ({ label: item.name, value: String(item.id) }));

const usePeriodTypeFetch = <T,>(transform: (items: PeriodTypeT[]) => T) => {
  const [data, dispatch] = useReducer(
    (
      _state: { data: T; loading: boolean },
      action:
        | { type: "loading" }
        | { type: "success"; data: T }
        | { type: "error" },
    ) => {
      switch (action.type) {
        case "loading":
          return { data: _state.data, loading: true };
        case "success":
          return { data: action.data, loading: false };
        case "error":
          return { data: _state.data, loading: false };
      }
    },
    { data: transform([]), loading: true },
  );

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    periodTypeService
      .list({ page: 1, pageSize: 100 })
      .then(({ items }) => {
        if (!cancelled) {
          dispatch({ type: "success", data: transform(items) });
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
};

export const usePeriodTypeOptions = () => {
  const { data: periodTypeOptions, loading: loadingPeriodTypes } =
    usePeriodTypeFetch(buildOptions);
  return { periodTypeOptions, loadingPeriodTypes };
};

export const usePeriodTypeList = () => {
  const { data: periodTypes, loading: loadingPeriodTypes } =
    usePeriodTypeFetch((items) => items);
  return { periodTypes, loadingPeriodTypes };
};
