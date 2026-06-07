import type { PaginatedData } from "@shared/types/api.response.types";
import type { SubjectT } from "../../domain/entities/subject.types";

interface ApiSubject {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

function mapSubjectFromApi(apiSubject: ApiSubject): SubjectT {
  return {
    id: apiSubject.id,
    name: apiSubject.name,
    code: apiSubject.code,
    is_active: apiSubject.active,
  };
}

export function mapPaginatedSubjectResponse(
  data: PaginatedData<ApiSubject>,
): PaginatedData<SubjectT> {
  return {
    ...data,
    results: data.results.map(mapSubjectFromApi),
  };
}
