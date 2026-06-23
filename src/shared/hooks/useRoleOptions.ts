import { useCatalogOptions } from "./useCatalogOptions";
import { roleService } from "@features/iam/roles/roles.service";

export const useRoleOptions = () => {
  const { options, loading } = useCatalogOptions(
    () => roleService.list({ page: 1, pageSize: 100 }),
    [],
    (role) => ({ label: role.name, value: String(role.id) }),
  );
  return { roleOptions: options, loading };
};
