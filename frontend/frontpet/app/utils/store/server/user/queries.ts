// queries/userQueries.ts
import { crudRequest } from "@/app/utils/crudRequest"; 
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/app/utils/uistate/fetures/user"; 
import { FIKAT_URL } from "@/app/utils/constant";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";

// Function to get all users
export const getUsers = async () => {
  const token = useAuthenticationStore.getState().token;
  const response = await crudRequest({
    url: `${FIKAT_URL}/user`, // API URL for users using SCHOOL_URL
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Users Data:", response);
  return response;
};

// Function to get a user by ID
export const getUserById = async (selectedUser: string) => {
  const token = useAuthenticationStore.getState().token;
    const response = await crudRequest({
      url: `${FIKAT_URL}/user/profile/${selectedUser}`, // API URL for a specific user by ID using SCHOOL_URL
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User Data:", response);
    return response?.data;

};

// Custom hook to get all users
export const useGetUsers = () =>
  useQuery({
    queryKey: ["userInfo"], // Query key for users
    queryFn: getUsers,
    staleTime: 60000,
    cacheTime: 300000,
    onError: (error) => console.error("Error fetching users:", error),
  });

// Custom hook to get a user by ID
export const useGetUserById = (selectedUser:string) => {

  return useQuery({
    queryKey: ["userInfoID", selectedUser],
    queryFn: () => getUserById(selectedUser),
    staleTime: 60000,
    cacheTime: 300000,
    enabled: !!selectedUser, // Only run if user ID exists
    onError: (error) => console.error("Error fetching user by ID:", error),
  });
};
