import { useEffect, useReducer, useState } from "react";
import { representativeSelfService } from "./representative.service";
import type { RepresentadoT } from "./representative.types";

interface State {
  representados: RepresentadoT[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "loading" }
  | { type: "success"; representados: RepresentadoT[] }
  | { type: "error"; error: string };

function reducer(_s: State, a: Action): State {
  switch (a.type) {
    case "loading":
      return { representados: [], loading: true, error: null };
    case "success":
      return { representados: a.representados, loading: false, error: null };
    case "error":
      return { representados: [], loading: false, error: a.error };
  }
}

export const useRepresentados = () => {
  const [state, dispatch] = useReducer(reducer, {
    representados: [],
    loading: true,
    error: null,
  });
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    representativeSelfService
      .getRepresentados()
      .then((representados) => {
        if (cancelled) return;
        dispatch({ type: "success", representados });
        if (representados.length > 0) {
          setSelectedStudentId((prev) => prev ?? representados[0].studentId);
        }
      })
      .catch(() => {
        if (!cancelled)
          dispatch({
            type: "error",
            error: "No se pudieron cargar tus representados",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    representados: state.representados,
    selectedStudentId,
    setSelectedStudentId,
    loading: state.loading,
    error: state.error,
  };
};
