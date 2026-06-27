import { useCatalogOptions } from "@shared/hooks/useCatalogOptions";
import { useAcademicPeriodOptions } from "@shared/hooks/useAcademicPeriodOptions";
import { STATUS_OPTIONS } from "@shared/hooks/useStatusOptions";
import { evaluationBlockService } from "@features/grading/evaluation-blocks/evaluation-blocks.service";

export const useBlockComponentFilterCatalogs = () => {
  const { academicPeriodOptions } = useAcademicPeriodOptions();

  const { options: evaluationBlockOptions, loading: loadingBlocks } = useCatalogOptions(
    () => evaluationBlockService.list({ page: 1, pageSize: 100 }).then((r) => r.items),
    [],
    (b) => ({ label: b.name, value: String(b.id) }),
  );

  return { evaluationBlockOptions, academicPeriodOptions, statusOptions: STATUS_OPTIONS, loadingBlocks };
};
