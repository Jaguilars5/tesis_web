import { useEffect, useReducer } from "react";

import { apiClient } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";

import { TEACHER_ENDPOINTS } from "../teacher-subject-section.constants";

import { academicGradeService } from "@features/institutions/academic-grade/academic-grade.service";
import { schoolYearService } from "@features/institutions/school-year/school-year.service";
import { sectionService } from "@features/institutions/section/section.service";
import { subjectService } from "@features/academic/subject/subject.service";

import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { UserT } from "@features/iam/users/users.types";

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

const useCatalogOptions = <T,>(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { options: state.options, loading: state.loading };
};

export type GradeFilterValue = number | 0;
export type SchoolYearFilterValue = number | 0;
export type SectionFilterValue = number | 0;
export type SubjectFilterValue = number | 0;
export type TeacherFilterValue = number | 0;
export type StatusFilterValue = "" | "active" | "inactive";

export const useTeacherAssignmentFilters = () => {
  const { options: gradeOptions, loading: loadingGrades } = useCatalogOptions(
    () => academicGradeService.list({ page: 1, pageSize: 100 }),
    [],
    (g) => ({ label: g.name, value: String(g.id) }),
  );

  const { options: schoolYearOptions, loading: loadingSchoolYears } =
    useCatalogOptions(
      () => schoolYearService.list({ page: 1, pageSize: 100 }),
      [],
      (y) => ({ label: y.name ?? `Año ${y.id}`, value: String(y.id) }),
    );

  const { options: sectionOptions, loading: loadingSections } = useCatalogOptions(
    () => sectionService.list({ page: 1, pageSize: 100 }),
    [],
    (s) => {
      const parts = [s.school_year_name, s.academic_grade_name, s.parallel]
        .filter(Boolean)
        .join(" - ");
      return { label: parts || `Sección ${s.id}`, value: String(s.id) };
    },
  );

  const { options: subjectOptions, loading: loadingSubjects } = useCatalogOptions(
    () => subjectService.list({ page: 1, pageSize: 100 }).then((r) => r.items),
    [],
    (s) => ({ label: s.name, value: String(s.id) }),
  );

  const { options: teacherOptions, loading: loadingTeachers } = useCatalogOptions(
    async () => {
      const { data } = await apiClient.get<ResponseApi<{ results: UserT[] }>>(
        `${TEACHER_ENDPOINTS.LIST}?page=1&page_size=100`,
      );
      return data.data.results;
    },
    [],
    (u: UserT) => {
      const fullName = `${u.names} ${u.last_names}`.trim();
      return {
        label: fullName || u.email || `Usuario ${u.id}`,
        value: String(u.id),
      };
    },
  );

  const statusOptions: SelectOptionT[] = [
    { label: "Activos", value: "active" },
    { label: "Inactivos", value: "inactive" },
  ];

  return {
    gradeOptions,
    schoolYearOptions,
    sectionOptions,
    subjectOptions,
    teacherOptions,
    statusOptions,
    loading: {
      grades: loadingGrades,
      schoolYears: loadingSchoolYears,
      sections: loadingSections,
      subjects: loadingSubjects,
      teachers: loadingTeachers,
    },
  };
};
