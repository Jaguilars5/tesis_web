import { jwtDecode } from "jwt-decode";
import type { AppJwtPayloadT } from "../../domain/entities/auth.types";

const REFRESH_TOKEN_KEY = "refresh_token";
const REFRESH_THRESHOLD_MS = 60 * 1000;

let runtimeAccessToken: string | null = null;

function getTokenExpiration(token: string): number {
  const payload = jwtDecode<AppJwtPayloadT>(token);
  if (payload.exp) return payload.exp * 1000;
  return 0;
}

function isTokenNearExpiry(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;
  return expiration - Date.now() <= REFRESH_THRESHOLD_MS;
}

function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return Date.now() >= expiration;
}

export const tokenManager = {
  getAccessToken() { return runtimeAccessToken; },
  getRefreshToken() { return localStorage.getItem(REFRESH_TOKEN_KEY); },
  setTokens(access: string, refresh: string) {
    runtimeAccessToken = access;
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  updateAccessToken(access: string) { runtimeAccessToken = access; },
  clearTokens() {
    runtimeAccessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  hasAccessToken() { return Boolean(runtimeAccessToken); },
  hasRefreshToken() { return Boolean(this.getRefreshToken()); },
  isAccessTokenNearExpiry() { return runtimeAccessToken ? isTokenNearExpiry(runtimeAccessToken) : false; },
  isAccessTokenExpired() { return runtimeAccessToken ? isTokenExpired(runtimeAccessToken) : true; },
};
