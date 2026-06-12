import { useQuery } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { requestHeader } from "@/components/helpers/requestHeader";

// -----------------------------
// 🧾 Product Payload Type
// -----------------------------
export interface Product {
  title: any;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isActive: boolean;
}

// -----------------------------
// ✅ Fetch All Products
// -----------------------------
const getProducts = async (): Promise<Product[]> => {
  return await crudRequest({
    url: `${FIKAT_URL}/products`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

// -----------------------------
// ✅ Fetch Single Product by ID
// -----------------------------
const getProductById = async (id: string): Promise<Product> => {
  return await crudRequest({
    url: `${FIKAT_URL}/products/${id}`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetProductById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id && enabled,
  });
};
