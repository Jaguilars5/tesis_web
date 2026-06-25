import { periodTypeService } from "@features/academic/period-types/period-types.service";
import type { PeriodTypeT } from "@features/academic/period-types/period-types.types";
import { useEffect, useReducer } from "react";

interface Option {
  label: string;
  value: string;
}

export const usePeriodTypeOptions = () => {
  const [periodTypeOptions, dispatch] = useReducer(
    (
      _state: Option[],
      action: { type: "success"; options: Option[] } | { type: "error" },
    ) => (action.type === "success" ? action.options : []),
    [],
  );
  const [loadingPeriodTypes, setLoading] = useReducer(
    (_state: boolean, action: { type: "loading" } | { type: "done" }) =>
      action.type === "loading",
    true,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading({ type: "loading" });
    periodTypeService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: items.map((item) => ({
              label: item.name,
              value: String(item.id),
            })),
          });
          setLoading({ type: "done" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: "error" });
          setLoading({ type: "done" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { periodTypeOptions, loadingPeriodTypes };
};

export const usePeriodTypeList = () => {
  const [periodTypes, dispatch] = useReducer(
    (
      _state: PeriodTypeT[],
      action: { type: "success"; items: PeriodTypeT[] } | { type: "error" },
    ) => (action.type === "success" ? action.items : []),
    [],
  );
  const [loadingPeriodTypes, setLoading] = useReducer(
    (_state: boolean, action: { type: "loading" } | { type: "done" }) =>
      action.type === "loading",
    true,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading({ type: "loading" });
    periodTypeService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          dispatch({ type: "success", items });
          setLoading({ type: "done" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: "error" });
          setLoading({ type: "done" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { periodTypes, loadingPeriodTypes };
};
