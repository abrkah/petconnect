"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Card,
  Select,
  Upload,
  ConfigProvider,
  Divider,
} from "antd";
import type { UploadFile } from "antd/es/upload";
import Link from "next/link";
import {
  PlusOutlined,
  CameraOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  api,
  buildPetFormData,
  petPhotoSrc,
  type PetGender,
} from "@/lib/petconnect-api";

type Pet = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender?: string | null;
  weight?: number | null;
  photoUrl?: string | null;
};

const GENDER_OPTIONS: { value: PetGender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function OwnerPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [form] = Form.useForm();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const resetModal = () => {
    setOpen(false);
    setEditing(null);
    form.resetFields();
    setPhotoFile(null);
    setFileList([]);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Pet[]>("/pets/mine");
      setPets(data);
    } catch {
      message.error("Could not load pets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resolvePhotoFile = (): File | null => {
    if (photoFile) return photoFile;
    const item = fileList[0];
    if (!item) return null;
    return (item.originFileObj as File | undefined) ?? null;
  };

  const submit = async (values: Record<string, unknown>) => {
    const photo = resolvePhotoFile();
    if (!editing && !photo) {
      message.error("Please upload a pet photo (image file required)");
      return;
    }

    setSubmitting(true);
    try {
      const fd = buildPetFormData(values, photo);
      if (editing) {
        const { data } = await api.patch<{ message?: string }>(
          `/pets/${editing.id}`,
          fd,
        );
        message.success(
          data.message ?? `${values.name} was updated successfully`,
        );
      } else {
        const { data } = await api.post<{ message?: string }>("/pets", fd);
        message.success(
          data.message ?? `${values.name} was added successfully`,
        );
      }
      await load();
      resetModal();
    } catch (err: unknown) {
      const msg = (
        err as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      if (Array.isArray(msg)) {
        message.error(msg.join(", "));
      } else if (typeof msg === "string") {
        message.error(msg);
      } else {
        message.error("Save failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setPhotoFile(null);
    setFileList([]);
    setOpen(true);
  };

  const openEdit = (p: Pet) => {
    setEditing(p);
    form.setFieldsValue({
      name: p.name,
      breed: p.breed,
      age: p.age,
      weight: p.weight ?? undefined,
      gender: p.gender ?? undefined,
    });
    setPhotoFile(null);
    if (p.photoUrl) {
      setFileList([
        {
          uid: "-1",
          name: "current-photo",
          status: "done",
          url: petPhotoSrc(p.photoUrl),
        },
      ]);
    } else {
      setFileList([]);
    }
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My pets
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your pet profiles — open a hub for weight, vaccines, and bookings.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="!h-11 !rounded-xl !border-0 !bg-emerald-600 hover:!bg-emerald-500"
          onClick={openAdd}
        >
          Add pet
        </Button>
      </div>

      {loading && pets.length === 0 ? (
        <div className="py-20 text-center text-slate-500">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((p) => (
            <Card
              key={p.id}
              loading={loading}
              classNames={{ body: "!p-0" }}
              className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-square w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={petPhotoSrc(p.photoUrl)}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                  <li>
                    <span className="text-slate-400">Breed </span>
                    <span className="font-medium text-slate-800">
                      {p.breed}
                    </span>
                  </li>
                  <li>
                    <span className="text-slate-400">Age </span>
                    <span className="font-medium text-slate-800">
                      {p.age} yrs
                    </span>
                  </li>
                  {p.gender ? (
                    <li>
                      <span className="text-slate-400">Gender </span>
                      <span className="font-medium capitalize text-slate-800">
                        {p.gender}
                      </span>
                    </li>
                  ) : null}
                  <li>
                    <span className="text-slate-400">Weight </span>
                    <span className="font-medium text-slate-800">
                      {p.weight != null && p.weight !== undefined
                        ? `${p.weight} kg`
                        : "—"}
                    </span>
                  </li>
                </ul>
                <div className="mt-5 flex gap-3">
                  <Link href={`/owner/pets/${p.id}`} className="flex-1">
                    <Button
                      type="primary"
                      block
                      className="!rounded-xl !bg-sky-600 hover:!bg-sky-500"
                    >
                      View
                    </Button>
                  </Link>
                  <Button
                    block
                    className="!rounded-xl !border-emerald-500 !font-semibold !text-emerald-700 hover:!border-emerald-600 hover:!text-emerald-800"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && pets.length === 0 && (
        <Card className="rounded-2xl border-dashed">
          <p className="mb-4 text-slate-600">
            You haven&apos;t added a pet yet.
          </p>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Add your first pet
          </Button>
        </Card>
      )}

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#059669",
            borderRadius: 12,
          },
          components: {
            Input: { controlHeight: 44 },
            Select: { controlHeight: 44 },
            InputNumber: { controlHeight: 44 },
            Form: { itemMarginBottom: 20 },
          },
        }}
      >
        <Modal
          open={open}
          onCancel={submitting ? undefined : resetModal}
          maskClosable={!submitting}
          closable={!submitting}
          footer={null}
          width="min(520px, calc(100vw - 3rem))"
          centered
          forceRender
          closeIcon={<CloseOutlined className="!text-slate-400" />}
          styles={{
            wrapper: { padding: 20, boxSizing: "border-box" },
            content: {
              margin: 0,
              padding: 0,
              maxHeight: "calc(100dvh - 40px)",
              overflow: "hidden",
            },
            body: {
              padding: 0,
              maxHeight: "calc(100dvh - 40px)",
              overflow: "hidden",
            },
          }}
          classNames={{
            content: "!rounded-2xl !shadow-xl",
            header: "!hidden",
            body: "!p-0",
          }}
        >
          <div className="flex max-h-[calc(100dvh-40px)] flex-col">
            <div
              className="shrink-0 border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 to-white"
              style={{ padding: "20px 28px 18px" }}
            >
              <h3 className="pr-8 text-xl font-bold tracking-tight text-slate-900">
                {editing ? "Edit pet" : "Add pet"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {editing
                  ? "Update details or replace the photo."
                  : "Create a profile for vaccines, weight tracking, and bookings."}
              </p>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto"
              style={{ padding: "24px 28px 28px" }}
            >
              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                disabled={submitting}
                onFinish={submit}
                style={{ margin: 0 }}
              >
                <div className="grid gap-x-4 gap-y-0 sm:grid-cols-2">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Name is required" },
                    ]}
                    className="sm:col-span-2"
                  >
                    <Input size="large" placeholder="e.g. Max" />
                  </Form.Item>
                  <Form.Item
                    name="breed"
                    label="Breed"
                    rules={[
                      { required: true, message: "Breed is required" },
                    ]}
                    className="sm:col-span-2"
                  >
                    <Input size="large" placeholder="e.g. Golden Retriever" />
                  </Form.Item>
                  <Form.Item
                    name="age"
                    label="Age"
                    rules={[{ required: true, message: "Age is required" }]}
                  >
                    <InputNumber
                      min={0}
                      max={50}
                      size="large"
                      className="!w-full"
                      placeholder="Years"
                    />
                  </Form.Item>
                  <Form.Item name="weight" label="Weight kg (optional)">
                    <InputNumber
                      min={0}
                      size="large"
                      className="!w-full"
                      placeholder="kg"
                    />
                  </Form.Item>
                  <Form.Item
                    name="gender"
                    label="Gender (optional)"
                    className="sm:col-span-2"
                  >
                    <Select
                      size="large"
                      allowClear
                      placeholder="Select gender"
                      options={GENDER_OPTIONS}
                    />
                  </Form.Item>
                </div>

                <Divider className="!my-6 !border-slate-100" />

                <Form.Item
                  label={
                    <span className="font-medium text-slate-700">
                      {editing ? "Photo (optional)" : "Photo"}
                    </span>
                  }
                  required={!editing}
                  help={
                    <span className="text-xs text-slate-400">
                      Upload an image file — not a URL. JPEG, PNG, GIF, WebP, or
                      HEIC · max 5 MB
                    </span>
                  }
                >
                  <div className="flex justify-center">
                    <Upload
                      listType="picture-card"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic,.jpg,.jpeg,.png,.heic"
                      maxCount={1}
                      fileList={fileList}
                      disabled={submitting}
                      className="[&_.ant-upload.ant-upload-select]:!h-[120px] [&_.ant-upload.ant-upload-select]:!w-[120px]"
                      beforeUpload={(file) => {
                        const ok =
                          /^image\/(jpe?g|pjpeg|png|gif|webp|heic|heif)/i.test(
                            file.type,
                          ) ||
                          /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(file.name);
                        if (!ok) {
                          message.error(
                            "Use JPEG, PNG, GIF, WebP, or HEIC (max 5 MB).",
                          );
                          return Upload.LIST_IGNORE;
                        }
                        setPhotoFile(file);
                        setFileList([
                          {
                            uid: file.uid,
                            name: file.name,
                            status: "done",
                            originFileObj: file,
                          },
                        ]);
                        return false;
                      }}
                      onRemove={() => {
                        setPhotoFile(null);
                        setFileList([]);
                      }}
                    >
                      {fileList.length < 1 && (
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <CameraOutlined className="text-xl" />
                          </span>
                          <span className="text-sm font-medium text-slate-600">
                            Add photo
                          </span>
                        </div>
                      )}
                    </Upload>
                  </div>
                </Form.Item>

                <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6">
                  <Button
                    type="button"
                    size="large"
                    disabled={submitting}
                    className="!h-11 flex-1 !rounded-xl"
                    onClick={resetModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    disabled={submitting}
                    className="!h-11 flex-[1.4] !rounded-xl !border-0 !bg-emerald-600 !font-semibold hover:!bg-emerald-500"
                  >
                    {submitting
                      ? editing
                        ? "Saving…"
                        : "Adding pet…"
                      : editing
                        ? "Save changes"
                        : "Add pet"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}
