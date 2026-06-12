// hooks/consultancy/mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { requestHeader } from "@/components/helpers/requestHeader";
import { handleSuccessMessage } from "@/app/utils/showSuccessmessage";
import { ConsultancyPayload } from "./interface";

// 🔸 CREATE consultancy
const createConsultancy = async (payload: ConsultancyPayload) => {
  return await crudRequest({
    url: `${FIKAT_URL}/consultancy`,
    method: "POST",
    headers: requestHeader(),
    data: payload,
  });
};

export const useCreateConsultancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConsultancy,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0]?.toString().includes("consultancy"),
      });
      handleSuccessMessage("POST");
    },
  });
};

// 🔸 UPDATE consultancy
const updateConsultancy = async (
  id: string,
  payload: Partial<ConsultancyPayload>
) => {
  return await crudRequest({
    url: `${FIKAT_URL}/consultancy/${id}`,
    method: "PATCH",
    headers: requestHeader(),
    data: payload,
  });
};

export const useUpdateConsultancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ConsultancyPayload>;
    }) => updateConsultancy(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0]?.toString().includes("consultancy"),
      });
      handleSuccessMessage("PATCH");
    },
  });
};

// 🔸 DELETE consultancy
const deleteConsultancy = async (id: string) => {
  return await crudRequest({
    url: `${FIKAT_URL}/consultancy/${id}`,
    method: "DELETE",
    headers: requestHeader(),
  });
};

export const useDeleteConsultancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConsultancy,
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0]?.toString().includes("consultancy"),
      });
      const method = variables?.method?.toUpperCase() || "DELETE";
      handleSuccessMessage(method);
    },
  });
};
const updateConsultancyStatus = async (
  id: string,
  status: "Approved" | "Rejected"
) => {
  return crudRequest({
    url: `${FIKAT_URL}/consultancy/${id}`,
    method: "PATCH",
    headers: requestHeader(),
    data: { status },
  });
};

export const useApproveConsultancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => updateConsultancyStatus(id, "Approved"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0]?.toString().includes("consultancy"),
      });
      handleSuccessMessage("Approved");
    },
  });
};

export const useRejectConsultancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => updateConsultancyStatus(id, "Rejected"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0]?.toString().includes("consultancy"),
      });
      handleSuccessMessage("Rejected");
    },
  });
};
