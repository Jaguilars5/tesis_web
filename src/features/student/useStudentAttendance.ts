import { useCallback, useEffect, useReducer } from "react"; import { useStudentData } from "./useStudentData"; import { studentApiService } from "./student.service"; import type { AttendanceRecord } from "./student.types";
interface State { records: AttendanceRecord[]; loading: boolean; error: string | null; }
type Action = { type: "loading" } | { type: "success"; records: AttendanceRecord[] } | { type: "error"; error: string };
function reducer(_s: State, a: Action): State { switch (a.type) { case "loading": return { records: [], loading: true, error: null }; case "success": return { records: a.records, loading: false, error: null }; case "error": return { records: [], loading: false, error: a.error }; } }
export const useStudentAttendance = () => {
  const { enrollments, loading: loadingStudent } = useStudentData();
  const [state, dispatch] = useReducer(reducer, { records: [], loading: false, error: null });
  const load = useCallback(async () => { if (enrollments.length === 0) return; let c = false; dispatch({ type: "loading" }); try { const records = await studentApiService.getAttendances(enrollments[0].id); if (!c) dispatch({ type: "success", records }); } catch { if (!c) dispatch({ type: "error", error: "Error al cargar asistencias" }); } return () => { c = true; }; }, [enrollments]);
  useEffect(() => { load(); }, [load]); return { records: state.records, loading: state.loading || loadingStudent, error: state.error, reload: load }; };
