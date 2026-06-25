import { useEffect, useState } from "react";

import { apiClient } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";

import { TEACHER_ENDPOINTS } from "../teacher-subject-section.constants";

import type { UserT } from "@features/iam/users/users.types";

interface Option {
  label: string;
  value: string;
}

export const useUserOptions = () => {
  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<ResponseApi<{ results: UserT[] }>>(
        `${TEACHER_ENDPOINTS.LIST}?page=1&page_size=100`,
      )
      .then(({ data }) => {
        if (!cancelled) {
          setUserOptions(
            data.data.results.map((i) => {
              const fullName = `${i.names} ${i.last_names}`.trim();
              return {
                label: fullName || i.email || `Usuario ${i.id}`,
                value: String(i.id),
              };
            }),
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

  return { userOptions, loading };
};
