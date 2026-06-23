import { useEffect, useReducer } from "react";

interface Option {
  label: string;
  value: string;
}

interface CatalogState {
  options: Option[];
  loading: boolean;
}

type CatalogAction =
  | { type: "loading" }
  | { type: "success"; options: Option[] }
  | { type: "error" };

function catalogReducer(state: CatalogState, action: CatalogAction): CatalogState {
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

export const useCatalogOptions = <T,>(
  loader: Loader<T>,
  deps: ReadonlyArray<unknown>,
  map: (item: T) => Option,
) => {
  const [state, dispatch] = useReducer(catalogReducer, { options: [], loading: true });

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
