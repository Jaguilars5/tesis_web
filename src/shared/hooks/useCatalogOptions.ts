import { useEffect, useReducer } from "react";

export interface CatalogOption {
  label: string;
  value: string;
}

interface CatalogState<O extends CatalogOption> {
  options: O[];
  loading: boolean;
}

type CatalogAction<O extends CatalogOption> =
  | { type: "loading" }
  | { type: "success"; options: O[] }
  | { type: "error" };

function catalogReducer<O extends CatalogOption>(
  state: CatalogState<O>,
  action: CatalogAction<O>,
): CatalogState<O> {
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

type Loader<T> = () => Promise<T[]>;

export const useCatalogOptions = <T, O extends CatalogOption = CatalogOption>(
  loader: Loader<T>,
  deps: ReadonlyArray<unknown>,
  map: (item: T) => O,
) => {
  const [state, dispatch] = useReducer(
    catalogReducer<O>,
    { options: [], loading: true },
  );

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    loader()
      .then((items) => {
        if (!cancelled) {
          dispatch({ type: "success", options: items.map(map) });
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
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { options: state.options, loading: state.loading };
};
