import { crudRequest } from "@/app/utils/crudRequest"; 
import { useQuery } from "@tanstack/react-query";
import { useMessageStore } from "@/app/utils/uistate/fetures/message"; 
import { FIKAT_URL } from "@/app/utils/constant"; 
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication"; 
// Function to get all messages


export const getMessages = async () => {
  try {
    const token = useAuthenticationStore.getState().token;
    console.log("token:", token);

    const response = await crudRequest({
      url: `${FIKAT_URL}/message`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("response:", response);
    console.log("Messages Dataa:", response?.data);

    return response;
  } catch (error) {
    console.error("Error in getMessages:", error);
    return [];
  }
};


export const useGetMessages = () =>
  useQuery({
    queryKey: ["messages"],
    queryFn: getMessages,
    staleTime: 60000, // 1 minute stale time
    cacheTime: 300000, // 5 minutes cache
    onError: (error) => console.error("Error fetching messages:", error),
  });


// Function to get a message by ID
export const getMessageById = async (selectedMessage) => {
  if (!selectedMessage) {
    throw new Error("No message ID provided");
  }

  try {
    const response = await crudRequest({
      url: `${FIKAT_URL}/message/${selectedMessage}`,
      method: "GET",
    });
    console.log("Message Data:", response);
    return response;
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    throw error;
  }
};

// Custom hook to get all messages

// Custom hook to get a message by ID
export const useGetMessageById = () => {
  const { selectedMessage } = useMessageStore(); // Fetch message ID from state
  return useQuery({
    queryKey: ["messageInfoID", selectedMessage],
    queryFn: () => getMessageById(selectedMessage),
    staleTime: 60000,
    cacheTime: 300000,
    enabled: !!selectedMessage, // Only run if message ID exists
    onError: (error) => console.error("Error fetching message by ID:", error),
  });
};
