import { sectionService } from "@features/institutions/section/section.service";
import { useEffect, useReducer } from "react";

type Option = { label: string; value: string };

export const useSectionOptions = () => {
  const [sectionOptions, dispatch] = useReducer(
    (
      _state: Option[],
      action: { type: "success"; options: Option[] } | { type: "error" },
    ) => {
      switch (action.type) {
        case "success":
          return action.options;
        case "error":
          return [];
      }
    },
    [],
  );
  const [loadingSections, setLoading] = useReducer(
    (_state: boolean, action: { type: "loading" } | { type: "done" }) => {
      switch (action.type) {
        case "loading":
          return true;
        case "done":
          return false;
      }
    },
    true,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading({ type: "loading" });
    sectionService
      .list({ page: 1, pageSize: 100 })
      .then((sections) => {
        if (!cancelled) {
          dispatch({
            type: "success",
            options: sections.map((section) => ({
              label: section.parallel,
              value: String(section.id),
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

  return { sectionOptions, loadingSections };
};
