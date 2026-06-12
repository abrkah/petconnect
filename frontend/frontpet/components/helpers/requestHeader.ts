import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";

const token = useAuthenticationStore.getState().token;
const userId = useAuthenticationStore.getState().userId;

export const requestHeader = () => ({
  Authorization: `Bearer ${token}`,
  ...(userId && { userId }),
});
