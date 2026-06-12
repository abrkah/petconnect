import { useQuery } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { requestHeader } from "@/components/helpers/requestHeader";

// -----------------------------
// 🧾 Plan Payload Type
// -----------------------------
export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

// -----------------------------
// ✅ Fetch All Plans
// -----------------------------
const getPlans = async (): Promise<Plan[]> => {
  return await crudRequest({
    url: `${FIKAT_URL}/plans`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });
};

// -----------------------------
// ✅ Fetch Single Plan by ID
// -----------------------------
const getPlanById = async (id: string): Promise<Plan> => {
  return await crudRequest({
    url: `${FIKAT_URL}/plans/${id}`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetPlanById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: () => getPlanById(id),
    enabled: !!id && enabled,
  });
};
