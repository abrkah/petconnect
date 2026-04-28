import { useMutation } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { message } from "antd";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { FIKAT_URL } from "@/app/utils/constant";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  id: string;
  role?: string;
}

const loginRequest = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await crudRequest({
    url: `${FIKAT_URL}/auth/login`,
    method: "POST",
    data,
  });
  return response;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      const { setToken, setUserId, setLoggedUserRole } =
        useAuthenticationStore.getState();

      setToken(data.token);
      setUserId(data.id);
      setLoggedUserRole(data.role || "");

      // Persist in localStorage
      localStorage.setItem("login", "true");
      localStorage.setItem("userId", data.id);
      localStorage.setItem("Role", data.role || "");

      console.log("Logged in user ID:", data.id);
      message.success("Login successful");
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    },
  });
};
