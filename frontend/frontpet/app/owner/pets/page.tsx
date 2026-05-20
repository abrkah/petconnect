"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Input,
  Modal,
  Form,
  Select,
  InputNumber,
  Upload,
  Tooltip,
  Tag,
  Popconfirm,
} from "antd";

const { Option } = Select;

const mockPets = [
  { id: 1, name: "Buddy", breed: "Golden Retriever", age: 3, weight: 13.5, gender: "Male", photo: "/dogCat.png", vaccinations: 4, bookings: 2 },
  { id: 2, name: "Luna", breed: "Siamese Cat", age: 2, weight: 4.2, gender: "Female", photo: null, vaccinations: 3, bookings: 1 },
  { id: 3, name: "Max", breed: "Bulldog", age: 5, weight: 22.1, gender: "Male", photo: null, vaccinations: 5, bookings: 0 },
];

const petEmojis: Record<string, string> = {
  "Golden Retriever": "🐕",
  "Siamese Cat": "🐈",
  "Bulldog": "🐶",
};

export default function PetsListPage() {
  const [pets, setPets] = useState(mockPets);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [form] = Form.useForm();

  const filtered = pets.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.breed.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingPet(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (pet: any) => {
    setEditingPet(pet);
    form.setFieldsValue(pet);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingPet) {
      setPets((prev) => prev.map((p) => (p.id === editingPet.id ? { ...p, ...values } : p)));
    } else {
      setPets((prev) => [...prev, { ...values, id: Date.now(), photo: null, vaccinations: 0, bookings: 0 }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <div className="max-w-screen-xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
            <p className="text-gray-500 mt-1">Manage all your furry family members</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={openAdd}
            className="bg-blue-600 border-blue-600 rounded-xl h-11 px-6 font-semibold"
          >
            Add New Pet
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search pets by name or breed..."
            size="large"
            className="rounded-xl max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Pets Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-lg font-semibold text-gray-700">No pets found</h3>
            <p className="text-gray-400 mb-6">Add your first pet to get started!</p>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} className="bg-blue-600 border-blue-600 rounded-xl">
              Add Pet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                {/* Image Section */}
                <div className="w-full h-38 bg-gradient-to-br from-blue-100 to-blue-500 flex items-center justify-center text-6xl overflow-hidden">
                  {pet.photo ? (
                    <img src="/dogCat.png" alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    petEmojis[pet.breed] || "🐾"
                  )}
                </div>

                {/* Details Section */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{pet.breed}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4 ">
                    {[
                      { label: "Age", value: `${pet.age} yrs` },
                      { label: "Weight", value: `${pet.weight} kg` },
                      { label: "Vaccines", value: pet.vaccinations },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/owner/pets/${pet.id}`} className="flex-1">
                      <Button
                        type="primary"
                        block
                        className="bg-blue-600 border-blue-600 rounded-lg font-semibold h-9"
                      >
                        View
                      </Button>
                    </Link>
                    <Button
                      type="default"
                      onClick={() => openEdit(pet)}
                      className="rounded-lg h-9 w-12 flex items-center justify-center"
                      style={{ backgroundColor: "#10b981", borderColor: "#10b981", color: "white" }}
                    >
                      <EditOutlined />
                    </Button>
                    <Popconfirm
                      title="Delete pet"
                      description="Are you sure you want to delete this pet?"
                      onConfirm={() => handleDelete(pet.id)}
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger className="rounded-lg h-9 w-12 flex items-center justify-center">
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xl">{editingPet ? "✏️" : "➕"}</span>
            <span className="text-lg font-bold">{editingPet ? "Edit Pet" : "Add New Pet"}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={520}
        className="rounded-2xl"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Pet Name" name="name" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="e.g. Buddy" size="large" className="rounded-xl" />
            </Form.Item>
            <Form.Item label="Breed" name="breed" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="e.g. Golden Retriever" size="large" className="rounded-xl" />
            </Form.Item>
            <Form.Item label="Age (years)" name="age" rules={[{ required: true, message: "Required" }]}>
              <InputNumber min={0} max={30} className="w-full rounded-xl" size="large" placeholder="e.g. 3" />
            </Form.Item>
            <Form.Item label="Weight (kg)" name="weight" rules={[{ required: true, message: "Required" }]}>
              <InputNumber min={0} step={0.1} className="w-full rounded-xl" size="large" placeholder="e.g. 12.5" />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
              <Select placeholder="Select gender" size="large" className="rounded-xl">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="Photo (optional)" name="photo">
            <Upload.Dragger accept="image/*" maxCount={1} className="rounded-xl">
              <p className="ant-upload-text text-sm text-gray-500">Click or drag photo here</p>
            </Upload.Dragger>
          </Form.Item>
          <div className="flex gap-3 mt-2">
            <Button size="large" block onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="primary" size="large" block htmlType="submit" className="bg-blue-600 border-blue-600 rounded-xl font-semibold">
              {editingPet ? "Save Changes" : "Add Pet"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}