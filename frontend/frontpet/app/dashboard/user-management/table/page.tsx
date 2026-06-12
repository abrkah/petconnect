"use client";

import { useState, useEffect } from "react";
import { Table, Button, Form, Input, Select, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useGetUsers } from "@/app/utils/store/server/user/queries";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import CustomDrawerLayout from "@/components/drawer";
import { useGetRoles } from "@/app/utils/store/server/role";
import {
  useCreateUser,
  useUpdateUser,
} from "@/app/utils/store/server/user/mutation";

const { Option } = Select;

type Role = { id: string; name: string };

type User = {
  id: string;
  name: string;
  email?: string;
  user_image: string;
  phone: string;
  role: { id: string; name: string };
  address: string;
  sex: string;
};

const UserListPage = () => {
  const { data: usersData = [], isLoading } = useGetUsers();
  const { data: rolesData = [] } = useGetRoles();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { mutate: createUser, isLoading: creating } = useCreateUser();
  const { mutate: updateUser, isLoading: updating } = useUpdateUser();

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Sync filtered users with API data
  useEffect(() => {
    setFilteredUsers(usersData);
  }, [usersData]);

  // Search handler
  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = usersData.filter(
      (user) =>
        user.name?.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase()) ||
        user.phone?.toLowerCase().includes(value.toLowerCase()) ||
        user.role?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      createUser(
        { ...values, password: "absikah" }, // default password
        {
          onSuccess: () => {
            message.success("User created successfully");
            setCreateDrawerOpen(false);
            createForm.resetFields();
          },
          onError: () => {
            message.error("Failed to create user");
          },
        }
      );
    } catch {
      message.error("Please fill in all required fields.");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!selectedUser?.id) {
        message.error("No user selected for update.");
        return;
      }

      updateUser(
        { userData: values, userId: selectedUser.id },
        {
          onSuccess: () => {
            message.success("User updated successfully");
            setEditDrawerOpen(false);
            setSelectedUser(null);
            editForm.resetFields();
          },
          onError: () => {
            message.error("Failed to update user");
          },
        }
      );
    } catch {
      message.error("Please fill in all required fields.");
    }
  };

  const openEditDrawer = (user: User) => {
    setSelectedUser(user);
    setEditDrawerOpen(true);
    editForm.setFieldsValue({
      ...user,
      roleId: user.role?.id,
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "user_image",
      fixed: "left",
      width: 60,
      render: (photo: string) => (
        <div className="flex items-center justify-center px-1">
          <Image
            src={photo || "/trainer.jfif"}
            alt="User Photo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Role",
      dataIndex: "role",
      render: (role: any) => role?.name || "-",
    },
    { title: "Phone", dataIndex: "phone" },
    { title: "Address", dataIndex: "address" },
    { title: "Sex", dataIndex: "sex" },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 60,
      render: (_: any, record: User) => (
        <div className="flex items-center gap-2 justify-center">
          <Link href={`user-management/${record.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#0063A7]">
              <EyeOutlined className="text-white" />
            </button>
          </Link>
          <button
            onClick={() => openEditDrawer(record)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-500"
          >
            <EditOutlined className="text-white" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold whitespace-nowrap">Users</h2>

        {/* Search */}
        <div className="mx-4 w-[300px]">
          <Input.Search
            placeholder="Search users..."
            allowClear
            enterButton
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateDrawerOpen(true)}
          loading={creating}
        >
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: true }}
      />

      {/* Create Drawer */}
      <CustomDrawerLayout
        open={createDrawerOpen}
        onClose={() => {
          setCreateDrawerOpen(false);
          createForm.resetFields();
        }}
        title="Add User"
        width="35%"
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit}>
          <UserFormFields rolesData={rolesData} />
          <FormActions
            onCancel={() => setCreateDrawerOpen(false)}
            loading={creating}
          />
        </Form>
      </CustomDrawerLayout>

      {/* Edit Drawer */}
      <CustomDrawerLayout
        open={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        width="35%"
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <UserFormFields rolesData={rolesData} />
          <FormActions
            onCancel={() => setEditDrawerOpen(false)}
            loading={updating}
          />
        </Form>
      </CustomDrawerLayout>
    </div>
  );
};

const UserFormFields = ({ rolesData }: { rolesData: Role[] }) => (
  <>
    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
      <Input placeholder="Enter name" />
    </Form.Item>

    <Form.Item
      name="email"
      label="Email"
      rules={[{ required: true, type: "email" }]}
    >
      <Input placeholder="Enter email" />
    </Form.Item>

    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
      <Input placeholder="Enter phone number" />
    </Form.Item>

    <Form.Item name="address" label="Address">
      <Input placeholder="Enter address" />
    </Form.Item>

    <Form.Item name="sex" label="Sex" rules={[{ required: true }]}>
      <Select placeholder="Select sex">
        <Option value="male">Male</Option>
        <Option value="female">Female</Option>
        <Option value="other">Other</Option>
      </Select>
    </Form.Item>

    <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
      <Select placeholder="Select role">
        {rolesData?.map((role) => (
          <Option key={role.id} value={role.id}>
            {role.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </>
);

const FormActions = ({
  onCancel,
  loading,
}: {
  onCancel: () => void;
  loading?: boolean;
}) => (
  <div className="text-right">
    <Button onClick={onCancel} className="mr-2">
      Cancel
    </Button>
    <Button type="primary" htmlType="submit" loading={loading}>
      Submit
    </Button>
  </div>
);

export default UserListPage;
