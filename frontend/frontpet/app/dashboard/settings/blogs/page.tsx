"use client";

import {
  Table,
  Button,
  Image as AntImage,
  Popconfirm,
  message,
  Space,
} from "antd";
import { useState } from "react";

import CreateBlogModal from "./_component/CreateBlogModal"; 
import EditBlogModal from "./_component/EditBlogModal"; 

import {
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
} from "@/app/utils/store/server/blog/mutation"; 
import { useGetBlogs } from "@/app/utils/store/server/blog/query";

type Blog = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export default function BlogsPage() {
  const { data: blogs = [], isLoading } = useGetBlogs();
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditingBlog(null);
    setIsEditModalOpen(false);
  };

  // Mutation hooks
  const { mutate: createBlog } = useCreateBlog();
  const { mutate: updateBlog } = useUpdateBlog();
  const { mutate: deleteBlog } = useDeleteBlog();

  // Handlers
  const handleCreate = (newBlog: Omit<Blog, "id">) => {
    createBlog(newBlog, {
      onSuccess: () => {
        message.success("Blog created successfully");
        closeCreateModal();
      },
    });
  };

  const handleSave = (updatedBlog: Omit<Blog, "id">) => {
    if (!editingBlog) return;

    updateBlog(
      { id: editingBlog.id.toString(), payload: updatedBlog },
      {
        onSuccess: () => {
          message.success("Blog updated successfully");
          closeEditModal();
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteBlog(id.toString(), {
      onSuccess: () => {
        message.success("Blog deleted successfully");
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src: string) => (
        <AntImage
          src={src}
          alt="Blog Image"
          width={80}
          height={50}
          style={{ objectFit: "cover", borderRadius: 6 }}
          preview={false}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Subtitle",
      dataIndex: "subtitle",
      key: "subtitle",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (_: any, record: Blog) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white shadow rounded-md max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Blogs</h2>
        <Button type="primary" onClick={openCreateModal}>
          + Add Blog
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: 5,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <CreateBlogModal
        open={isCreateModalOpen}
        onCancel={closeCreateModal}
        onCreate={handleCreate}
      />

      <EditBlogModal
        open={isEditModalOpen}
        blog={editingBlog}
        onCancel={closeEditModal}
        onSave={handleSave}
      />
    </div>
  );
}
