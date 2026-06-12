import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSuccessMessage } from "@/app/utils/showSuccessmessage";
import { requestHeader } from "@/components/helpers/requestHeader";

// Define blog payload type
export type BlogPayload = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

// ---------------------------
// ✅ Create Blog
// ---------------------------
const createBlog = async (payload: BlogPayload) => {
  return crudRequest({
    url: `${FIKAT_URL}/blogs`,
    method: "POST",
    headers: requestHeader(),
    data: payload,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("blog"),
      });
      handleSuccessMessage("POST");
    },
  });
};

// ---------------------------
// ✅ Update Blog
// ---------------------------
const updateBlog = async (id: string, payload: Partial<BlogPayload>) => {
  return crudRequest({
    url: `${FIKAT_URL}/blogs/${id}`,
    method: "PATCH",
    headers: requestHeader(),
    data: payload,
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<BlogPayload>;
    }) => updateBlog(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("blog"),
      });
      handleSuccessMessage("PATCH");
    },
  });
};

// ---------------------------
// ✅ Delete Blog
// ---------------------------
const deleteBlog = async (id: string) => {
  return crudRequest({
    url: `${FIKAT_URL}/blogs/${id}`,
    method: "DELETE",
    headers: requestHeader(),
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.toString().includes("blog"),
      });

      const method = variables?.method?.toUpperCase() || "DELETE";
      handleSuccessMessage(method);
    },
  });
};
