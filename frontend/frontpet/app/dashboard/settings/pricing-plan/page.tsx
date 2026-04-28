"use client";

import { Table, Button, Popconfirm, message, Space } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreatePlanModal from "./_component/createModal";
import EditPlanModal from "./_component/editModal";

import {
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
} from "@/app/utils/store/server/pricing/mutation";
import { useGetPlans } from "@/app/utils/store/server/pricing/query";

type Plan = {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
};

export default function PricingPlanTable() {
  const { data: plans = [], isLoading } = useGetPlans();
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditingPlan(null);
    setIsEditModalOpen(false);
  };

  const { mutate: createPlan } = useCreatePlan();
  const { mutate: updatePlan } = useUpdatePlan();
  const { mutate: deletePlan } = useDeletePlan();

  const handleCreate = (newPlan: Omit<Plan, "id" | "popular">) => {
    createPlan(newPlan, {
      onSuccess: () => {
        message.success("Plan created successfully");
        closeCreateModal();
      },
    });
  };

  const handleSave = (updatedPlan: Omit<Plan, "id" | "popular">) => {
    if (!editingPlan) return;

    updatePlan(
      { id: editingPlan.id.toString(), payload: updatedPlan },
      {
        onSuccess: () => {
          message.success("Plan updated successfully");
          closeEditModal();
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deletePlan(id.toString(), {
      onSuccess: () => {
        message.success("Plan deleted successfully");
      },
    });
  };

  const columns = [
    {
      title: "Plan Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Plan) => (
        <div>
          {text}{" "}
          {record.popular && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded">
              Most Popular
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Features",
      dataIndex: "features",
      key: "features",
      render: (features: string[]) => (
        <ul className="list-disc list-inside">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <CheckOutlined style={{ color: "green" }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (_: any, record: Plan) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this plan?"
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
        <h2 className="text-xl font-semibold">Pricing Plans</h2>
        <Button type="primary" onClick={openCreateModal}>
          + Add Plan
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={plans}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: 5,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <CreatePlanModal
        open={isCreateModalOpen}
        onCancel={closeCreateModal}
        onCreate={handleCreate}
      />

      <EditPlanModal
        open={isEditModalOpen}
        plan={editingPlan}
        onCancel={closeEditModal}
        onSave={handleSave}
      />
    </div>
  );
}
