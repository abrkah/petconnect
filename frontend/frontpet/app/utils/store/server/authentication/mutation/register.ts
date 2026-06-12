import { useMutation } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { message } from "antd";
import { FIKAT_URL } from "@/app/utils/constant";
import MessageService from "@/components/Success"; 

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

const registerRequest = async (data: RegisterPayload) => {
  console.log("data",data);
  return await crudRequest({
    url: `${FIKAT_URL}/auth/signup`,
    method: "POST",
    data,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      MessageService(
        "success",
        "Your account has been successfully registered."
      );
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    },
  });
};
