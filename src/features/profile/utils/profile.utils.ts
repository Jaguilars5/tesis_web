import type { AuthUserT } from '@features/auth/domain/entities/auth.types'

export function formatProfileName(user: AuthUserT): string {
  return `${user.names} ${user.last_names}`.trim()
}

export function validateProfileData(data: Partial<AuthUserT>): boolean {
  if (!data.names || !data.last_names || !data.email) {
    return false
  }
  return true
}