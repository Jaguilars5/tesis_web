import { useEffect, useReducer } from "react"; import { kinshipService } from "./kinship.service";
export const useKinshipOptions = () => {
  const [options, dispatch] = useReducer((_s: { label: string; value: string }[], a: { type: "success"; options: { label: string; value: string }[] } | { type: "error" }) => { switch (a.type) { case "success": return a.options; case "error": return []; } }, []);
  const [loading, setLoading] = useReducer((_s: boolean, a: { type: "loading" } | { type: "done" }) => { switch (a.type) { case "loading": return true; case "done": return false; } }, true);
  useEffect(() => { let c = false; setLoading({ type: "loading" }); kinshipService.list({ page: 1, pageSize: 100 }).then((items) => { if (!c) { dispatch({ type: "success", options: items.map((i) => ({ label: i.name, value: String(i.id) })) }); setLoading({ type: "done" }); } }).catch(() => { if (!c) { dispatch({ type: "error" }); setLoading({ type: "done" }); } }); return () => { c = true; }; }, []);
  return { kinshipOptions: options, loading };
};
