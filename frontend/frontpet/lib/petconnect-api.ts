import axios, { AxiosInstance } from "axios";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5003";

export const api: AxiosInstance = axios.create({ baseURL });

const PET_PLACEHOLDER =
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=70";

export function petPhotoSrc(photoUrl?: string | null): string {
  if (!photoUrl?.trim()) return PET_PLACEHOLDER;
  if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
    return photoUrl;
  }
  const path = photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`;
  return `${baseURL}${path}`;
}

export type PetGender = "male" | "female" | "other";

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
  const { data } = await axios.post(`${baseURL}/auth/login`, { email, password });
  return data as {
    id: string;
    token: string;
    role: UserRole;
    isFirstLogin: boolean;
  };
}

export async function signupApi(body: {
  email: string;
  password: string;
  role: UserRole;
}) {
  const { data } = await axios.post(`${baseURL}/auth/signup`, body);
  return data as string;
}
