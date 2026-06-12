"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUserStore } from "@/app/utils/uistate/fetures/user";
import {
  useCreateUser,
  useUpdateUser,
} from "@/app/utils/store/server/user/mutation";
import { useGetUserById } from "@/app/utils/store/server/user/queries";
import { useGetRoles } from "@/app/utils/store/server/role";

const { Option } = Select;

const UserForm: React.FC = () => {
  const { data: roles = [], isLoading, error } = useGetRoles();
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const {selectedUser}= useUserStore();
  const [userImage, setUserImage] = useState<File | null>(null);

  const { data: userData } = useGetUserById(selectedUser);
  console.log("userData", userData, selectedUser);
  const { setIsDrawerOpen } = useUserStore();
  const [form] = Form.useForm();

  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();

  const handleCancel = () => {
    form.resetFields();
    setUserImage(null);
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (formMode === "edit" && userData) {
      form.setFieldsValue({
        name: userData.name || "",
        email: userData.email || "",
        password: "", // don't preload password
        role: userData.role?.id || null,
        // user_image: userData.user_image || null,
        phone: userData.phone || "",
        address: userData.address || "",
        sex: userData.sex || undefined,
      });
    }
  }, [formMode, userData, form]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        name: values.name,
        email: values.email,
        password: values.password,
        // user_image: userImage ? await convertToBase64(userImage) : null,
        roleId: values.role,
        isDeleted: false,
        phone: values.phone,
        address: values.address,
        sex: values.sex,
      };

      if (formMode === "create") {
        createUser(formData, {
          onSuccess: () => {
            setIsDrawerOpen(false);
            form.resetFields();
          },
        });
      } else if (formMode === "edit") {
        formData["id"] = selectedUser;
        updateUser(formData, {
          onSuccess: () => {
            setIsDrawerOpen(false);
            form.resetFields();
          },
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const convertToBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter name" }]}
      >
        <Input placeholder="Enter name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please enter email" }]}
      >
        <Input type="email" placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={
          formMode === "create"
            ? [{ required: true, message: "Please enter password" }]
            : []
        }
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item label="Role" name="role">
        <Select
          placeholder="Select role"
          loading={isLoading}
          disabled={isLoading || !!error}
        >
          {roles?.map((role: any) => (
            <Option key={role.id} value={role.id}>
              {role.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Phone" name="phone">
        <Input placeholder="Enter phone number" />
      </Form.Item>

      <Form.Item label="Address" name="address">
        <Input placeholder="Enter address" />
      </Form.Item>

      <Form.Item label="Sex" name="sex">
        <Select placeholder="Select sex" allowClear>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      {/* <Form.Item label="User Image">
        <Upload
          beforeUpload={(file) => {
            setUserImage(file);
            return false; // prevent automatic upload
          }}
        >
          <Button icon={<UploadOutlined />}>Upload User Image</Button>
        </Upload>
      </Form.Item> */}

      <Form.Item>
  <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
    <Button type="primary" htmlType="submit">
      {formMode === "create" ? "Create User" : "Update User"}
    </Button>
    <Button onClick={handleCancel}>Cancel</Button>
  </div>
</Form.Item>

    </Form>
  );
};

export default UserForm;
