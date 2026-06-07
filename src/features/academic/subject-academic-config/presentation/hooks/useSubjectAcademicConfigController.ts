import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectSubjectAcademicConfigError,
  selectSubjectAcademicConfigs,
  selectSubjectAcademicConfigsStatus,
} from "../../reducers/subject-academic-config.selectors";
import { fetchSubjectAcademicConfigs } from "../../reducers/subject-academic-config.reducer";


export const useSubjectAcademicConfigController = () => {
  const dispatch = useAppDispatch();
  const subjectAcademicConfigs = useAppSelector(selectSubjectAcademicConfigs);
  const status = useAppSelector(selectSubjectAcademicConfigsStatus);
  const error = useAppSelector(selectSubjectAcademicConfigError);

  const loadSubjectAcademicConfigs = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchSubjectAcademicConfigs(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  return {
    subjectAcademicConfigs,
    isLoading: status === "loading",
    error,
    loadSubjectAcademicConfigs,
  };
};
