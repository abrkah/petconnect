// hooks/consultancy/query.ts
import { useQuery } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { requestHeader } from "@/components/helpers/requestHeader";

export interface Consultancy {
  id: string;
  userId: string;
  name: string;
  email: string;
  date: string;
  time: string;
  topic: string;
  notes?: string;
}

// 🔹 Fetch all consultancies
const getAllConsultancies = async (): Promise<Consultancy[]> => {
  return await crudRequest({
    url: `${FIKAT_URL}/consultancy`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetAllConsultancies = () =>
  useQuery({
    queryKey: ["consultancy", "all"],
    queryFn: getAllConsultancies,
  });

// 🔹 Fetch consultancies by userId
const getConsultancyByUserId = async (
  userId: string
): Promise<Consultancy[]> => {
  return await crudRequest({
    url: `${FIKAT_URL}/consultancy/user/${userId}`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetConsultancyByUserId = (userId: string, enabled = true) =>
  useQuery({
    queryKey: ["consultancy", "user", userId],
    queryFn: () => getConsultancyByUserId(userId),
    enabled: !!userId && enabled,
  });

// 🔹 Fetch single consultancy by ID
const getConsultancyById = async (id: string): Promise<Consultancy> => {
  return await crudRequest({
    url: `${FIKAT_URL}/consultancy/${id}`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetConsultancyById = (id: string, enabled = true) =>
  useQuery({
    queryKey: ["consultancy", id],
    queryFn: () => getConsultancyById(id),
    enabled: !!id && enabled,
  });
