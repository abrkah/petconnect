"use client";

import {
  Table,
  Button,
  Image as AntImage,
  Switch,
  Popconfirm,
  Space,
  message,
} from "antd";
import { useState } from "react";
import CreateProductModal from "./_components/CreateProductModal";
import EditProductModal from "./_components/EditProductModal";

import { useGetProducts } from "@/app/utils/store/server/product/query";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/app/utils/store/server/product/mutation";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  isActive: boolean;
};

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const [currentPage, setCurrentPage] = useState(1);

  // Create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(false);
  };

  // Mutations
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();

 
  
  const { mutate: deleteProduct } = useDeleteProduct();

  // Handlers
  const handleCreate = (newProduct: Omit<Product, "id">) => {
    createProduct(newProduct, {
      onSuccess: () => {
        message.success("Product added successfully");
        closeCreateModal();
      },
    });
  };

  const handleSave = (updatedProduct: Omit<Product, "id">) => {
    if (!editingProduct) return;

    updateProduct(updatedProduct, {
      onSuccess: () => {
        message.success("Product updated successfully");
        closeEditModal();
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteProduct(id.toString(), {
      onSuccess: () => {
        message.success("Product deleted successfully");
      },
    });
  };
  

  const handleToggleActive = (checked: boolean, product: Product) => {
    updateProduct(
      { id: product.id.toString(), payload: { isActive: checked } },
      {
        onSuccess: () => {
          message.success("Product status updated");
        },
      }
    );
  };
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text: string) => (
        <AntImage
          src={text}
          alt="Product Image"
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: 6 }}
          preview={false}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (_: boolean, record: Product) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleToggleActive(checked, record)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Product) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
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
        <h2 className="text-xl font-semibold">Products</h2>
        <Button type="primary" onClick={openCreateModal}>
          + Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: 5,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <CreateProductModal
        open={isCreateModalOpen}
        onCancel={closeCreateModal}
        onCreate={handleCreate}
      />

      <EditProductModal
        open={isEditModalOpen}
        product={editingProduct}
        onCancel={closeEditModal}
        onSave={handleSave}
      />
    </div>
  );
}
