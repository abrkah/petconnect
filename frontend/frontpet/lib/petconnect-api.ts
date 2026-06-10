import axios, { AxiosInstance } from "axios";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5003";

export const api: AxiosInstance = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = useAuthenticationStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
