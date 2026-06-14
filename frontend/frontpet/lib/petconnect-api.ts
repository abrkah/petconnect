import axios, { AxiosInstance } from "axios";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";

/** Wrong host often set in Vercel; real service URL is on the Render dashboard. */
const WRONG_RENDER_API = "https://petconnect-api.onrender.com";
const DEFAULT_RENDER_API = "https://petconnect-api-52ux.onrender.com";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.endsWith(".vercel.app")) {
      return DEFAULT_RENDER_API;
    }
  }

  const raw =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5003";
  if (raw === WRONG_RENDER_API || raw.includes("petconnect-api.onrender.com")) {
    return DEFAULT_RENDER_API;
  }
  return raw;
}

export const api: AxiosInstance = axios.create();

api.defaults.baseURL = getApiBaseUrl();

export function petPhotoSrc(photoUrl?: string | null): string | null {
  if (!photoUrl?.trim()) return null;
  if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
    return photoUrl;
  }
  const path = photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`;
  return `${getApiBaseUrl()}${path}`;
}

export function buildPetPayload(values: Record<string, unknown>) {
  const payload: Record<string, string | number> = {
    name: String(values.name ?? "").trim(),
    breed: String(values.breed ?? "").trim(),
    age: Number(values.age),
  };
  const weight = values.weight;
  if (weight != null && weight !== "") {
    payload.weight = Number(weight);
  }
  if (values.gender) {
    payload.gender = String(values.gender).toLowerCase();
  }
  return payload;
}

export type PetGender = "male" | "female";

export function buildPetFormData(
  values: Record<string, unknown>,
  photo?: File | null,
): FormData {
  const fd = new FormData();
  fd.append("name", String(values.name ?? "").trim());
  fd.append("breed", String(values.breed ?? "").trim());
  fd.append("age", String(values.age ?? ""));
  const weight = values.weight;
  if (weight != null && weight !== "") {
    fd.append("weight", String(weight));
  }
  if (values.gender) {
    fd.append("gender", String(values.gender).toLowerCase());
  }
  if (photo) {
    fd.append("photo", photo, photo.name || "pet-photo.jpg");
  }
  return fd;
}

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = useAuthenticationStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData && config.headers) {
    const h = config.headers as Record<string, unknown>;
    delete h["Content-Type"];
    delete h["content-type"];
  }
  return config;
});

export type UserRole = "OWNER" | "PROVIDER";

export async function loginApi(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  return data as {
    id: string;
    token: string;
    role: UserRole;
    isFirstLogin: boolean;
  };
}

export async function sendPhoneCode(phoneNumber: string) {
  const { data } = await api.post("/auth/phone/send-code", { phoneNumber });
  return data as { phoneNumber: string; devCode?: string };
}

export async function verifyPhoneCode(phoneNumber: string, code: string) {
  const { data } = await api.post("/auth/phone/verify-code", {
    phoneNumber,
    code,
  });
  return data as { phoneNumber: string };
}

export async function signupApi(body: {
  email: string;
  password: string;
  role: UserRole;
}) {
  const { data } = await api.post("/auth/signup", body);
  return data as { message: string };
}

export async function subscribeNewsletterApi(email: string) {
  const { data } = await api.post("/newsletter/subscribe", { email });
  return data as { message: string; alreadySubscribed: boolean };
}
