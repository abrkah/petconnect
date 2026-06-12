import { crudRequest } from "@/app/utils/crudRequest"; 
import { useQueryClient, useMutation } from "@tanstack/react-query";
import MessageService from "@/components/messageService"; 
import { FIKAT_URL } from "@/app/utils/constant"; 
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication"; 
import { useQuery } from "@tanstack/react-query";

export const getHeaders = () => {
  const token = useAuthenticationStore.getState().token;
  console.log('token',token)
  return { Authorization: `Bearer ${token}` };
};

// Function to log errors
const logError = (error: any, action: string) => {
  console.error(
    `Error during ${action}:`,
    error.response?.data || error.message
  );
};

// Create a message
export const createMessage = async (messageData: any) => {
  console.log("Creating message with data:", messageData);
  const headers = getHeaders();

  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/message/create`,
      method: "POST",
      headers,
      data: messageData,
    });
    return response.data; // Return the created message data
  } catch (error) {
    logError(error, "create message");
    throw error; // Ensure the error is thrown for the mutation to handle it
  }
};

// Hook for creating a message
export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMessage,
    onSuccess: (data) => {
      console.log("Message sent successfully:", data);
      queryClient.invalidateQueries("messages");
      MessageService("success", "Message created successfully");
    },
    onError: (error) => {
      logError(error, "create message");
      MessageService(
        "error",
        `Failed to create message: ${error.response?.data?.message || error}`
      );
    },
  });
};

// Update a message
export const updateMessage = async (messageData: any, messageId: string) => {
  const headers = getHeaders();
  console.log("Updating message with ID:", messageId);

  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/messages/${messageId}`,
      method: "PUT",
      headers,
      data: messageData,
    });
    return response.data;
  } catch (error) {
    logError(error, "update message");
    throw error;
  }
};

// Hook for updating a message
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageData,
      messageId,
    }: {
      messageData: any;
      messageId: string;
    }) => updateMessage(messageData, messageId),
    onSuccess: (data) => {
      console.log("Message updated successfully:", data);
      queryClient.invalidateQueries("messages");
      MessageService("success", "Message updated successfully");
    },
    onError: (error) => {
      logError(error, "update message");
      MessageService(
        "error",
        `Failed to update message: ${error.message || error}`
      );
    },
  });
};

// Delete a message
export const deleteMessage = async (messageId: string) => {
  const headers = getHeaders();
  console.log("Deleting message with ID:", messageId);

  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/messages/${messageId}`,
      method: "DELETE",
      headers,
    });
    return response.data;
  } catch (error) {
    logError(error, "delete message");
    throw error;
  }
};

// Hook for deleting a message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries("messages");
      MessageService("success", "Message deleted successfully");
    },
    onError: (error) => {
      logError(error, "delete message");
      MessageService(
        "error",
        `Failed to delete message: ${error.message || error}`
      );
    },
  });
};

// Fetch all messages
export const fetchMessages = async () => {
  const headers = getHeaders();
  console.log("Fetching all messages");

  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/messages`,
      method: "GET",
      headers,
    });
    return response.data;
  } catch (error) {
    logError(error, "fetch messages");
    throw error;
  }
};

// Hook for fetching messages
export const useFetchMessages = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: "messages",
    queryFn: fetchMessages,
    onSuccess: (data) => {
      console.log("Messages fetched successfully:", data);
    },
    onError: (error) => {
      logError(error, "fetch messages");
    },
  });
};

// Function to get a message by ID
const fetchMessageById = async (messageId: string) => {
  const headers = getHeaders();
  const response = await crudRequest({
    url: `${FIKAT_URL}/messages/${messageId}`,
    method: "GET",
    headers,
  });
  return response.data;
};

// Hook to fetch a message by ID
export const useGetMessagesById = (messageId: string | null) => {
  return useQuery({
    queryKey: ["message", messageId],
    queryFn: () => fetchMessageById(messageId!),
    enabled: !!messageId, // Only run the query if messageId is not null
    onError: (error) => {
      console.error("Error fetching message by ID:", error);
    },
  });
};
