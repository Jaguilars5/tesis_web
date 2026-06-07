const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 8;

export const validateUsername = (username: string): string | null => {
  if (!username.trim()) return "El usuario es obligatorio";
  if (username.length < USERNAME_MIN_LENGTH)
    return `El usuario debe tener al menos ${USERNAME_MIN_LENGTH} caracteres`;
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "La contraseña es obligatoria";
  if (password.length < PASSWORD_MIN_LENGTH)
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`;
  return null;
};

export const validateLoginInput = (
  username: string,
  password: string,
): Record<string, string> | null => {
  const errors: Record<string, string> = {};
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  if (usernameError) errors.username = usernameError;
  if (passwordError) errors.password = passwordError;
  return Object.keys(errors).length > 0 ? errors : null;
};
