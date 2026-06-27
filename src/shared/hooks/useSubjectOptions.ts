import { useCatalogOptions } from "./useCatalogOptions";
import { subjectService } from "@features/academic/subject/subject.service";

export const useSubjectOptions = () => {
  const { options, loading } = useCatalogOptions(
    () => subjectService.list({ page: 1, pageSize: 100 }).then((r) => r.items),
    [],
    (s) => ({ label: s.name, value: String(s.id) }),
  );
  return { subjectOptions: options, loading };
};
