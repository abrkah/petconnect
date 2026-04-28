import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSuccessMessage } from "@/app/utils/showSuccessmessage";
import { requestHeader } from "@/components/helpers/requestHeader";

// Define plan payload type
export type PlanPayload = {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
};

// ---------------------------
// ✅ Create Plan
// ---------------------------
const createPlan = async (payload: PlanPayload) => {
  return crudRequest({
    url: `${FIKAT_URL}/plans`,
    method: "POST",
    headers: requestHeader(),
    data: payload,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("plan"),
      });
      handleSuccessMessage("POST");
    },
  });
};

// ---------------------------
// ✅ Update Plan
// ---------------------------
const updatePlan = async (id: string, payload: Partial<PlanPayload>) => {
  return crudRequest({
    url: `${FIKAT_URL}/plans/${id}`,
    method: "PATCH",
    headers: requestHeader(),
    data: payload,
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<PlanPayload>;
    }) => updatePlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("plan"),
      });
      handleSuccessMessage("PATCH");
    },
  });
};

// ---------------------------
// ✅ Delete Plan
// ---------------------------
const deletePlan = async (id: string) => {
  return crudRequest({
    url: `${FIKAT_URL}/plans/${id}`,
    method: "DELETE",
    headers: requestHeader(),
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlan,
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("plan"),
      });

      const method = variables?.method?.toUpperCase() || "DELETE";
      handleSuccessMessage(method);
    },
  });
};
