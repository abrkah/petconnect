// storageHelper.ts

import { NextRequest } from "next/server";

/**
 * Client-side getCookie - reads cookie from document.cookie
 */
export const getCookieClient = (key: string): string | null => {
  if (typeof document === "undefined") return null; // safety for SSR
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

/**
 * Server-side getCookie - reads cookie from NextRequest
 */
export const getCookieServer = (
  key: string,
  request: NextRequest
): string | null => {
  const cookie = request.cookies.get(key);
  return cookie ? cookie.value : null;
};

/**
 * Sets a cookie with a specified key, value, and optional expiration days (client-side)
 */
export const setCookie = (key: string, value: any, days?: number): void => {
  if (typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = key + "=" + (value || "") + expires + "; path=/";
};

/**
 * Removes a cookie by key (client-side)
 */
export const removeCookie = (key: string): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Session storage helpers (client-side only)
export const setSession = (key: string, value: any): void => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getSession = <T>(key: string): T | null => {
  if (typeof sessionStorage === "undefined") return null;
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const removeSession = (key: string): void => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(key);
};
