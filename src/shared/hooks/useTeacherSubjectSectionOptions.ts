import { useEffect, useReducer } from "react";

import { selectAuthUser } from "@features/auth/auth.slice";
import { UserRoleEnum } from "@features/auth";
import { teacherSubjectSectionService } from "@features/academic/teacher-subject-section";
import { useAppSelector } from "@shared/redux/hooks";

import type { TeacherSubjectSectionListParamsT } from "@features/academic/teacher-subject-section";

interface Option {
  label: string;
  value: string;
}

interface State {
  options: Option[];
  loading: boolean;
}

type Action =
  | { type: "loading" }
  | { type: "success"; options: Option[] }
  | { type: "error" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { options: [], loading: true };
    case "success":
      return { options: action.options, loading: false };
    case "error":
      return { options: [], loading: false };
  }
}

interface UseTeacherSubjectSectionOptionsParams {
  /**
   * Filtra por estado activo/inactivo.
   * - Cuando el rol del usuario autenticado es TEACHER, este valor se ignora
   *   y siempre se usa `true` (el docente solo debe ver sus clases activas).
   * - Para otros roles (admin, director, etc.) se usa el valor recibido.
   *   Si se omite, no se aplica filtro de estado.
   */
  isActive?: boolean;
}

/**
 * Hook de fuente única para las opciones del selector "Clase"
 * (TeacherSubjectSection) utilizado en los módulos de calificación y asistencia.
 *
 * - Formato de label: `subject_offering_name`
 * - Si rol = TEACHER: filtra por usuario, asignación activa y año lectivo activo.
 * - Si otro rol: respeta el parámetro `isActive` recibido.
 */
export const useTeacherSubjectSectionOptions = (
  { isActive }: UseTeacherSubjectSectionOptionsParams = {},
) => {
  const [state, dispatch] = useReducer(reducer, {
    options: [],
    loading: true,
  });

  const user = useAppSelector(selectAuthUser);
  const isTeacher = user?.role === UserRoleEnum.TEACHER;

  // Los docentes siempre ven solo sus clases activas.
  const effectiveIsActive = isTeacher ? true : isActive;

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });

    const params: TeacherSubjectSectionListParamsT = {
      page: 1,
      pageSize: 100,
    };

    const filters: TeacherSubjectSectionListParamsT["filters"] = {};

    if (isTeacher && user) {
      filters.user = user.id;
      filters.is_active = true;
      filters.school_year_is_active = true;
    } else if (effectiveIsActive !== undefined) {
      filters.is_active = effectiveIsActive;
    }

    if (Object.keys(filters).length > 0) {
      params.filters = filters;
    }

    teacherSubjectSectionService
      .list(params)
      .then(({ items }) => {
        if (cancelled) return;

        // Refuerzo en cliente por si el backend ignora algún filtro.
        const visible = isTeacher && user
          ? items.filter((i) => i.user === user.id && i.is_active)
          : items;

        dispatch({
          type: "success",
          options: visible.map((i) => ({
            label: i.subject_offering_name,
            value: String(i.id),
          })),
        });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [user, isTeacher, effectiveIsActive]);

  return { teacherSubjectSectionOptions: state.options, loading: state.loading };
};
