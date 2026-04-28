// hooks/useUserQueries.ts
import { useQuery } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { FIKAT_URL } from "@/app/utils/constant";

// Fetch user profile data
const fetchUserprofile = async () => {
  const token = useAuthenticationStore.getState().token;
  const headers = { Authorization: `Bearer ${token}` };

  const userData = await crudRequest({
    url: `${FIKAT_URL}/user/profile`,
    method: "GET",
    headers,
  });
  return userData;
};

// Fetch all users
const fetchAllUsers = async () => {
  const token = useAuthenticationStore.getState().token;
  const headers = { Authorization: `Bearer ${token}` };

  const response = await crudRequest({
    url: `${FIKAT_URL}/user`,
    method: "GET",
    headers,
  });
  return response;
};

// Hook: Get current user profile for header
export const useGetProfile = () =>
  useQuery({
    queryKey: ["userHeader"],
    queryFn: fetchUserprofile,
    staleTime: 60_000,
    cacheTime: 300_000,
    onError: (error) => console.error("Error fetching user header:", error),
  });

// Hook: Get all users list
export const useGetAllUsers = () =>
  useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
    staleTime: 60_000,
    cacheTime: 300_000,
    onError: (error) => console.error("Error fetching users:", error),
  });
const fetchUserProfileById = async (id: string) => {
  const token = useAuthenticationStore.getState().token;
  const headers = { Authorization: `Bearer ${token}` };

  const response = await crudRequest({
    url: `${FIKAT_URL}/user/userprofile/${id}`,
    method: "GET",
    headers,
  });

  return response;
};

// Hook
export const useGetUserProfileById = (id: string) =>
  useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => fetchUserProfileById(id),
    staleTime: 60_000,
    cacheTime: 300_000,
    enabled: !!id, // Only fetch if id exists
    onError: (error) => console.error("Error fetching user profile:", error),
  });
