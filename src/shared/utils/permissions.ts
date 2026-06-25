export const hasPermission = (
  userPermissions: string[],
  required: string | null,
): boolean => {
  if (!required) return true;
  const normalizedRequired = required.trim().toLowerCase();
  return userPermissions.some(
    (p) => p.trim().toLowerCase() === normalizedRequired,
  );
};
