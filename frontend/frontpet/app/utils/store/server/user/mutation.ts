import { crudRequest } from "@/app/utils/crudRequest"; 
import { useQueryClient, useMutation } from "@tanstack/react-query";
import MessageService from "@/components/messageService"; 
import { FIKAT_URL } from "@/app/utils/constant"; 
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication"; 
import { useQuery } from "@tanstack/react-query";

// Function to get headers with the authentication token
export const getHeaders = () => {
  const token = useAuthenticationStore.getState().token;
  return { Authorization: `Bearer ${token}` };
};

// Function to log errors
const logError = (error: any, action: string) => {
  console.error(
    `Error during ${action}:`,
    error.response?.data || error.message
  );
};

// Create a user
export const createUser = async (userData: any) => {
  console.log("Creating user with data:", userData);
  const headers = getHeaders();
  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/auth/signup`,
      method: "POST",
      headers,
      data: userData,
    });
    return response.data; // Return the created user data
  } catch (error) {
    logError(error, "create user");
    throw error; // Ensure the error is thrown for the mutation to handle it
  }
};

// Hook for creating a user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log("User created successfully:", data);
      queryClient.invalidateQueries("users");
      MessageService("success", "User created successfully");
    },
    onError: (error) => {
      logError(error, "create user");
      MessageService(
        "error",
        `Failed to create user: ${error.response?.data?.message || error}`
      );
    },
  });
};

// Update a user
export const updateUser = async (userData: any, userId: string) => {
  const headers = getHeaders();
  console.log("Updating user with ID:", userId);

  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/user/profile/${userId}`, // Updated to user endpoint
      method: "PUT",
      headers,
      data: userData,
    });
    return response.data;
  } catch (error) {
    logError(error, "update user");
    throw error;
  }
};

// Hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userData, userId }: { userData: any; userId: string }) =>
      updateUser(userData, userId),
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
      queryClient.invalidateQueries("users");
      MessageService("success", "User updated successfully");
    },
    onError: (error) => {
      logError(error, "update user");
      MessageService(
        "error",
        `Failed to update user: ${error.message || error}`
      );
    },
  });
};

// Delete a user
export const deleteUser = async (userId: string) => {
  const headers = getHeaders();
  console.log("Deleting user with ID:", userId);

  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/users/${userId}`, // Updated to user endpoint
      method: "DELETE",
      headers,
    });
    return response.data;
  } catch (error) {
    logError(error, "delete user");
    throw error;
  }
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      MessageService("success", "User deleted successfully");
    },
    onError: (error) => {
      logError(error, "delete user");
      MessageService(
        "error",
        `Failed to delete user: ${error.message || error}`
      );
    },
  });
};

// Fetch all users
export const fetchUsers = async () => {
  const headers = getHeaders();
  console.log("Fetching all users");

  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/users`, // Updated to user endpoint
      method: "GET",
      headers,
    });
    return response.data;
  } catch (error) {
    logError(error, "fetch users");
    throw error;
  }
};

// Hook for fetching users
export const useFetchUsers = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: "users", // Query key for users
    queryFn: fetchUsers,
    onSuccess: (data) => {
      console.log("Users fetched successfully:", data);
    },
    onError: (error) => {
      logError(error, "fetch users");
    },
  });
};

// Function to get a user by ID
const fetchUserById = async (userId: string) => {
  const headers = getHeaders();
  const response = await crudRequest({
    url: `${FIKAT_URL}/user/profile/${userId}`, // Updated to user endpoint
    method: "GET",
    headers,
  });
  return response.data;
};

// Hook to fetch a user by ID
export const useGetUserById = (userId: string | null) => {
  return useQuery({
    queryKey: ["user", userId], // Query key for user by ID
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId, // Only run the query if userId is not null
    onError: (error) => {
      console.error("Error fetching user by ID:", error);
    },
  });
};
