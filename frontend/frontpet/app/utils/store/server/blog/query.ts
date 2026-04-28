import { useQuery } from "@tanstack/react-query";
import { crudRequest } from "@/app/utils/crudRequest";
import { FIKAT_URL } from "@/app/utils/constant"; 
import { requestHeader } from "@/components/helpers/requestHeader"; 

// -----------------------------
// 🧾 Blog Payload Type
// -----------------------------
export interface Blog {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

// -----------------------------
// ✅ Fetch All Blogs
// -----------------------------
const getBlogs = async (): Promise<Blog[]> => {
  return await crudRequest({
    url: `${FIKAT_URL}/blogs`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });
};

// -----------------------------
// ✅ Fetch Single Blog by ID
// -----------------------------
const getBlogById = async (id: string): Promise<Blog> => {
  return await crudRequest({
    url: `${FIKAT_URL}/blogs/${id}`,
    method: "GET",
    headers: requestHeader(),
  });
};

export const useGetBlogById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: !!id && enabled,
  });
};
