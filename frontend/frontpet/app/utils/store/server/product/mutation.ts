import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSuccessMessage } from "@/app/utils/showSuccessmessage";
import { requestHeader } from "@/components/helpers/requestHeader";
import { ProductPayload } from "./interface";

// ---------------------------
// ✅ Create Product
// ---------------------------
const createProduct = async (payload: ProductPayload) => {
  return crudRequest({
    url: `${FIKAT_URL}/products`,
    method: "POST",
    headers: requestHeader(),
    data: payload,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("product"),
      });
      handleSuccessMessage("POST");
    },
  });
};

// ---------------------------
// ✅ Update Product
// ---------------------------
const updateProduct = async (id: string, payload: Partial<ProductPayload>) => {
  return crudRequest({
    url: `${FIKAT_URL}/products/${id}`,
    method: "PATCH",
    headers: requestHeader(),
    data: payload,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ProductPayload>;
    }) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("product"),
      });
      handleSuccessMessage("PATCH");
    },
  });
};

// ---------------------------
// ✅ Delete Product
// ---------------------------
const deleteProduct = async (id: string) => {
  return crudRequest({
    url: `${FIKAT_URL}/products/${id}`,
    method: "DELETE",
    headers: requestHeader(),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("product"),
      });

      const method = variables?.method?.toUpperCase() || "DELETE";
      handleSuccessMessage(method);
    },
  });
};
