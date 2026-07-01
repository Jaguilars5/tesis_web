import { selectAuthUser } from "@features/auth/auth.slice"; import { useAppSelector } from "@shared/redux/hooks"; import { useEffect, useReducer } from "react"; import { studentApiService } from "./student.service"; import type { EnrollmentInfo } from "./student.types";
interface State { enrollments: EnrollmentInfo[]; loading: boolean; noActiveEnrollment: boolean; }
type Action = { type: "loading" } | { type: "success"; enrollments: EnrollmentInfo[] } | { type: "error" } | { type: "noActiveEnrollment" };
function reducer(_s: State, a: Action): State { switch (a.type) { case "loading": return { enrollments: [], loading: true, noActiveEnrollment: false }; case "success": return { enrollments: a.enrollments, loading: false, noActiveEnrollment: false }; case "error": return { enrollments: [], loading: false, noActiveEnrollment: false }; case "noActiveEnrollment": return { enrollments: [], loading: false, noActiveEnrollment: true }; } }
export const useStudentData = (studentIdOverride?: number | null) => {
  const user = useAppSelector(selectAuthUser); const studentId = studentIdOverride ?? user?.student_id ?? null;
  const [state, dispatch] = useReducer(reducer, { enrollments: [], loading: true, noActiveEnrollment: false });
  useEffect(() => { if (!studentId) { dispatch({ type: "error" }); return; } dispatch({ type: "loading" }); studentApiService.getActiveEnrollment(studentId).then((enrollment) => { dispatch({ type: "success", enrollments: [enrollment] }); }).catch((error) => { if (error?.response?.status === 404) dispatch({ type: "noActiveEnrollment" }); else dispatch({ type: "error" }); }); }, [studentId]);
  return { studentId, enrollments: state.enrollments, loading: state.loading, noActiveEnrollment: state.noActiveEnrollment };
};
