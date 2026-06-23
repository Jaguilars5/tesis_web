import { periodTypeService } from "@features/academic/period-types/period-types.service";
import type { PeriodTypeT } from "@features/academic/period-types/period-types.types";
import { schoolYearService } from "@features/institutions/school-year/school-year.service";
import { useEffect, useState } from "react";

interface Option {
  label: string;
  value: string;
}

export const usePeriodTypeOptions = () => {
  const [periodTypeOptions, setPeriodTypeOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    periodTypeService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setPeriodTypeOptions(
            items.map((i) => ({ label: i.name, value: String(i.id) })),
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { periodTypeOptions, loading };
};

export const usePeriodTypeList = () => {
  const [periodTypes, setPeriodTypes] = useState<PeriodTypeT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    periodTypeService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setPeriodTypes(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { periodTypes, loading };
};

export const useSchoolYearOptions = () => {
  const [schoolYearOptions, setSchoolYearOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    schoolYearService
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled) {
          setSchoolYearOptions(
            items.map((i) => ({ label: i.name, value: String(i.id) })),
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { schoolYearOptions, loading };
};
