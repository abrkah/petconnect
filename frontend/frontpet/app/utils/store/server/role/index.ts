import { crudRequest } from "@/app/utils/crudRequest";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { FIKAT_URL } from "@/app/utils/constant";

// Function to get all roles
export const getRoles = async () => {
  const token = useAuthenticationStore.getState().token;
  const response = await crudRequest({
    url: `${FIKAT_URL}/roles`, // Assuming your API endpoint for roles
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Roles Data:", response);
  return response;
};

// Custom hook to get all roles
export const useGetRoles = () =>
  useQuery({
    queryKey: ["roles"], // Query key for roles
    queryFn: getRoles,
    staleTime: 60000,
    cacheTime: 300000,
    onError: (error) => console.error("Error fetching roles:", error),
  });
