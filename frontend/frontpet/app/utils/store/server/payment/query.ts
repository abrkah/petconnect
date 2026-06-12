import { useQuery } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { requestHeader } from "@/components/helpers/requestHeader";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";

// Fetch payments for a specific user
export const useGetUserPayments = (userId: string | null) => {
  return useQuery({
    queryKey: ["payments", userId],
    queryFn: () => getUserPayments(userId),
    enabled: !!userId,
  });
};

const getUserPayments = async (userId: string | null) => {
  if (!userId) return [];
  const response = await crudRequest({
    url: `${FIKAT_URL}/payments/user/${userId}`,
    method: "GET",
    headers: requestHeader(),
  });
  return response;
};

// Fetch all payments
export const getPayments = async () => {
  const token = useAuthenticationStore.getState().token;
  const response = await crudRequest({
    url: `${FIKAT_URL}/payments`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Payments Data:", response);
  return response;
};

export const useGetPayments = () =>
  useQuery({
    queryKey: ["payments"],
    queryFn: getPayments,
    staleTime: 60000,
    cacheTime: 300000,
    onError: (error) => console.error("Error fetching payments:", error),
  });
export const getTopPerformingCourses = async () => {
  const token = useAuthenticationStore.getState().token;
  const response = await crudRequest({
    url: `${FIKAT_URL}/payments/top-courses`, // your backend endpoint for top courses
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Map backend response to frontend format
  return response.map((c: any, index: number) => ({
    key: String(index + 1),
    name: c.name,
    enrollments: Number(c.enrollments),
    rating: c.rating || 4.5, // default rating if not provided
    revenue: c.revenue,
  }));
};
export const useGetTopPerformingCourses = () =>
  useQuery({
    queryKey: ["topCourses"],
    queryFn: getTopPerformingCourses,
    staleTime: 60000,
    cacheTime: 300000,
    onError: (error) => console.error("Error fetching top courses:", error),
  });

  export const getInvoices = async () => {
    const token = useAuthenticationStore.getState().token;
    const response = await crudRequest({
      url: `${FIKAT_URL}/payments/invoices`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Map backend response to frontend-friendly format
    return response.map((c: any, index: number) => ({
      key: String(index + 1),
      id: c.id,
      invoiceNumber: c.invoiceNumber,
      paymentDate: c.paymentDate,
      status: c.status,
      amount: c.amount,
    }));
  };

  // React Query hook for invoices
  export const useGetInvoices = () =>
    useQuery({
      queryKey: ["invoices"],
      queryFn: getInvoices,
      staleTime: 60000,
      cacheTime: 300000,
      onError: (error) => console.error("Error fetching invoices:", error),
    });