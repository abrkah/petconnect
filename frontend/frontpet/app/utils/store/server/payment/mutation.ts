import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { message } from "antd";

const createPayment = async (data: {
  userId: string;
  courseId: string;
  amount: number;
}) => {
  return crudRequest({
    url: `${FIKAT_URL}/payments/create`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data,
  });
};

export const useSetPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      message.success("Payment saved!");
    },
    onError: () => {
      message.error("Failed to save payment!");
    },
  });
};
