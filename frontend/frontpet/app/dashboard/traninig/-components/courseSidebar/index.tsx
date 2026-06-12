"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, message, Select, Upload, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomDrawerFooterButton, {
  CustomDrawerFooterButtonProps,
} from "@/components/common/actionbutton/drawer/customdrawerFooterButton";
import CustomDrawerLayout from "@/components/common/actionbutton/drawer";
import CustomDrawerHeader from "@/components/common/actionbutton/drawer/customDrawerHeader";
import CustomLabel from "@/components/common/actionbutton/form/customLabel/customLable";
import { useTnaManagementStore } from "@/app/utils/uistate/fetures/training/managemnet";
import { useAuthenticationStore } from "@/app/utils/uistate/fetures/authentication";
import { formatLinkToUploadFile } from "@/components/helpers/formatTo";
import { useSetCourseManagement } from "@/app/utils/store/server/training/mutation";
import { useGetLevels } from "@/app/utils/store/server/training/query";

const { Option } = Select;

const CourseCategorySidebar = () => {
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [form] = Form.useForm();
  const [isDraft, setIsDraft] = useState(false);

  const {
    isShowCourseSidebar: isShow,
    setIsShowCourseSidebar,
    courseId,
    setCourseId,
  } = useTnaManagementStore();
  const { userId } = useAuthenticationStore();

  const { mutate: setCourse, isLoading } = useSetCourseManagement();
  const { data: levels, error } = useGetLevels();

  const onClose = useCallback(() => {
    setCourseId(null);
    form.resetFields();
    setIsDraft(false);
    setIsShowCourseCourseSidebar(false);
  }, [form, setCourseId, setIsShowCourseSidebar]);

  // Dummy data example, replace with API data if needed
  const coursesData = {
    items: [
      {
        id: "dummy-id",
        title: "Sample Course",
        thumbnail: "https://example.com/image.png",
        overview: "Sample Overview",
        level: "beginner",
      },
    ],
  };

  useEffect(() => {
    if (courseId && coursesData?.items?.length) {
      const item = coursesData.items.find((i) => i.id === courseId);
      if (item) {
        form.setFieldsValue({
          title: item.title,
          thumbnail: [formatLinkToUploadFile(item.thumbnail ?? "")],
          overview: item.overview,
          level: item.level || "beginner",
        });
      }
    }
  }, [courseId, coursesData, form]);

  const onFinish = (values: any) => {
    const formData = new FormData();

    // Append simple fields
    formData.append("title", values.title);
    formData.append("overview", values.overview);
    formData.append("levelId", values.level);
    formData.append("price", values.price);
    formData.append("hoursToFinish", values.hoursToFinish);
    formData.append("startingCapital", values.startingCapital);
    formData.append("profitPercent", values.profitPercent);
    formData.append("isDraft", String(isDraft));
    formData.append("preparedBy", userId);

    // Append image file if uploaded
    const file = values.thumbnail?.[0]?.originFileObj;
    if (file) {
      formData.append("thumbnail", file);
    }

    setCourse(formData, {
      onSuccess: () => {
        message.success("Course saved successfully!");
        setIsShowCourseSidebar(false);
      },
      onError: () => {
        message.error("Failed to save course. Please try again.");
      },
    });
  };


  const footerModalItems: CustomDrawerFooterButtonProps[] = [
    {
      label: "Cancel",
      key: "cancel",
      className: "h-14",
      size: "large",
      loading: isLoading,
      onClick: onClose,
    },
    {
      label: courseId ? "Edit" : "Create",
      key: "create",
      className: "h-14",
      type: "primary",
      size: "large",
      loading: isLoading,
      onClick: () => {
        setIsDraft(false);
        form.submit();
      },
    },
  ];

  return (
    isShow && (
      <CustomDrawerLayout
        open={isShow}
        onClose={onClose}
        modalHeader={
          <CustomDrawerHeader className="flex justify-center">
            {courseId ? "Edit Course" : "Add Course"}
          </CustomDrawerHeader>
        }
        footer={
          <CustomDrawerFooterButton
            className="w-1/2 mx-auto mt-5"
            buttons={footerModalItems}
          />
        }
        width="30%"
      >
        <Form
          layout="vertical"
          form={form}
          disabled={isLoading}
          onFinish={onFinish}
          requiredMark={CustomLabel}
        >
          <Form.Item
            name="title"
            label="Course Name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>

          <Form.Item
            name="level"
            label="Course Level"
            rules={[{ required: true, message: "Please select a level" }]}
          >
            <Select
              placeholder="Select course level"
              loading={isLoading}
              disabled={isLoading || !!error}
            >
              {levels?.map((level: { id: string; name: string }) => (
                <Option key={level.id} value={level.id}>
                  {level.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Enter price"
            />
          </Form.Item>

          <Form.Item
            name="hoursToFinish"
            label="Hours to Finish"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input
              type="number"
              min={1}
              step="1"
              placeholder="Estimated hours"
            />
          </Form.Item>

          <Form.Item
            name="startingCapital"
            label="Minimum Starting Capital"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Enter capital"
            />
          </Form.Item>

          <Form.Item
            name="profitPercent"
            label="Minimum Profit (%)"
            rules={[
              { required: true, message: "Required" },
              {
                validator: (_, value) => {
                  if (value === undefined || value === "")
                    return Promise.reject("Required");
                  const num = Number(value);
                  if (isNaN(num)) return Promise.reject("Must be a number");
                  if (num < 0 || num > 100)
                    return Promise.reject("Enter a value between 0 and 100");
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="number"
              min={0}
              max={100}
              step="0.1"
              placeholder="Enter profit %"
            />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Course Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              const files = Array.isArray(e) ? e : e?.fileList || [];
              return files.slice(0, 1); // Accept only 1 file
            }}
            rules={[{ required: true, message: "Required" }]}
          >
            <Upload
              beforeUpload={(file) => {
                setItemImage(file);
                return false; // Prevent auto-upload
              }}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="overview"
            label="Overview"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.TextArea rows={6} placeholder="Enter course description" />
          </Form.Item>
        </Form>
      </CustomDrawerLayout>
    )
  );
};

export default CourseCategorySidebar;
