"use client";

import { useState } from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Space,
} from "antd";
import { useGetCourseById } from "@/app/utils/store/server/training/query";
import { useParams, useRouter } from "next/navigation";
import CustomDrawerLayout from "@/components/drawer";
import {
  useSetCourseLesson,
  useCreateCourseMaterial,
} from "@/app/utils/store/server/training/mutation";
import { useTnaManagementCoursePageStore } from "@/app/utils/uistate/fetures/training/managemnet/coursePage";

const { Panel } = Collapse;

const FormActions = ({ onCancel }: { onCancel: () => void }) => (
  <div className="text-center mt-6">
    <Button onClick={onCancel} className="mr-3">
      Cancel
    </Button>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </div>
);

const CoursePage = () => {
  const { setLessonId } = useTnaManagementCoursePageStore();
  const router = useRouter();
  const { id } = useParams();
  const { data: course } = useGetCourseById(id);
  const { mutate: createLessons } = useSetCourseLesson(id);
  const { mutateAsync: addMaterial } = useCreateCourseMaterial();

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [materialDrawerOpen, setMaterialDrawerOpen] = useState(false);
  const [selectedLessonForMaterial, setSelectedLessonForMaterial] = useState<
    string | null
  >(null);

  const [createForm] = Form.useForm();
  const [materialForm] = Form.useForm();

  // Submit handler for adding lessons
  const handleCreateSubmit = async (values: { lessons: any[] }) => {
    try {
      const payloadWithCourseId = values.lessons.map((lesson) => ({
        ...lesson,
        courseId: id,
      }));

      createLessons(payloadWithCourseId);
      message.success("Lessons created successfully!");
      createForm.resetFields();
      setCreateDrawerOpen(false);
    } catch (error) {
      console.error("Error creating lessons:", error);
      message.error("Failed to create lessons. Please try again.");
    }
  };

  // Submit handler for adding course material
  const handleMaterialSubmit = async (values: any) => {
    if (!selectedLessonForMaterial) return;

    try {
      await addMaterial({
        ...values,
        courseLessonId: selectedLessonForMaterial,
      });
      message.success("Material added successfully!");
      setMaterialDrawerOpen(false);
      materialForm.resetFields();
      // Optional: refetch course or lessons here to update UI with new material
    } catch (error) {
      console.error("Error adding material:", error);
      message.error("Failed to add material. Please try again.");
    }
  };

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div className="  max-w-7xl mx-auto">
      <Card
        title={
          <div className="flex justify-between items-center bg-indigo-100 p-4 rounded-md shadow-sm">
            <h2 className="text-2xl font-extrabold text-indigo-900">
              📘 {course.title}: Lessons Overview
            </h2>
            <Button type="primary" onClick={() => setCreateDrawerOpen(true)}>
              + Add Course Lesson
            </Button>
          </div>
        }
        variant="outlined"
        className="shadow-md"
      >
        {course.courseLessons?.length > 0 ? (
          <Collapse
            accordion
            defaultActiveKey={String(course.courseLessons[0]?.id)}
            onChange={(key) => {
              const openedId = Array.isArray(key) ? key[0] : key;
              setLessonId(openedId ? String(openedId) : null);
            }}
          >
            {course.courseLessons.map((lesson, index) => (
              <Panel
                key={lesson.id}
                header={
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <BookOpenIcon className="h-5 w-5 text-indigo-500" />
                      <span>{lesson.title}</span>
                    </div>

                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent Collapse toggle when clicking button
                        setSelectedLessonForMaterial(lesson.id);
                        setMaterialDrawerOpen(true);
                        materialForm.resetFields();
                      }}
                      className="text-green-600"
                    >
                      + Add Material
                    </Button>
                  </div>
                }
              >
                <p className="mb-4 text-gray-700">{lesson.description}</p>

                {lesson.courseLessonMaterials?.length > 0 ? (
                  <ul className="mb-4 space-y-2 text-sm text-gray-700">
                    {lesson.courseLessonMaterials.map((material: any) => (
                      <li key={material.id}>
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/dashboard/traninig/${id}/${material.id}`
                            )
                          }
                          className="text-indigo-600 hover:underline"
                        >
                          • {material.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-500 mb-4">
                    No materials available
                  </p>
                )}
              </Panel>
            ))}
          </Collapse>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg font-medium">
              No lessons found for this course.
            </p>
            <p className="text-sm">Please add lessons to get started.</p>
          </div>
        )}
      </Card>

      {/* Drawer for adding lessons */}
      <CustomDrawerLayout
        open={createDrawerOpen}
        onClose={() => {
          setCreateDrawerOpen(false);
          createForm.resetFields();
        }}
        title="Add Course Lessons"
        width="40%"
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateSubmit}
          requiredMark
        >
          <Form.List name="lessons">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="border border-gray-200 rounded-md p-4 mb-4 bg-gray-50 relative"
                  >
                    <h4 className="font-semibold mb-2">Lesson {index + 1}</h4>

                    <Form.Item
                      {...restField}
                      name={[name, "title"]}
                      label="Lesson Title"
                      rules={[
                        { required: true, message: "Enter lesson title" },
                      ]}
                    >
                      <Input placeholder="Enter lesson title" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label="Lesson Description"
                      rules={[
                        { required: true, message: "Enter lesson description" },
                      ]}
                    >
                      <Input.TextArea
                        placeholder="Enter description"
                        rows={3}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "order"]}
                      label="Lesson Order"
                      rules={[
                        { required: true, message: "Enter lesson order" },
                      ]}
                    >
                      <InputNumber min={1} className="w-full" />
                    </Form.Item>

                    <Button
                      danger
                      onClick={() => remove(name)}
                      className="absolute top-2 right-2"
                      size="small"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<span>➕</span>}
                  >
                    Add Lesson
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <FormActions onCancel={() => setCreateDrawerOpen(false)} />
        </Form>
      </CustomDrawerLayout>

      <CustomDrawerLayout
        open={materialDrawerOpen}
        onClose={() => {
          setMaterialDrawerOpen(false);
          materialForm.resetFields();
        }}
        title="Add Course Material"
        width="40%"
      >
        <Form
          form={materialForm}
          layout="vertical"
          onFinish={handleMaterialSubmit}
          requiredMark
        >
          {/* Title */}
          <Form.Item
            name="name"
            label="Title"
            rules={[
              { required: true, message: "Please enter the material title" },
            ]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          {/* Introduction */}
          <Form.Item
            name="introduction"
            label="Introduction"
            rules={[{ required: true, message: "Please enter introduction" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter introduction" />
          </Form.Item>

          {/* Objectives - alternative enhanced UI */}
          <Form.List name="objectives">
            {(fields, { add, remove }) => (
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4 text-indigo-900">
                  Objectives
                </label>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex items-center gap-4 p-4 mb-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center select-none">
                      {index + 1}
                    </div>

                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[
                        {
                          required: true,
                          message: "Objective cannot be empty",
                        },
                      ]}
                      className="flex-grow mb-0"
                    >
                      <Input
                        placeholder={`Objective ${index + 1}`}
                        className="rounded-md border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                      />
                    </Form.Item>

                    <Button
                      type="text"
                      danger
                      onClick={() => remove(name)}
                      aria-label={`Remove objective ${index + 1}`}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  type="dashed"
                  block
                  onClick={() => add()}
                  className="text-indigo-600 hover:text-indigo-800 border-indigo-400"
                >
                  + Add Objective
                </Button>
              </div>
            )}
          </Form.List>

          {/* Steps - alternative enhanced UI */}
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4 text-indigo-900">
                  Steps
                </label>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex items-center gap-4 p-4 mb-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center select-none">
                      {index + 1}
                    </div>

                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[
                        { required: true, message: "Step cannot be empty" },
                      ]}
                      className="flex-grow mb-0"
                    >
                      <Input.TextArea
                        rows={2}
                        placeholder={`Step ${index + 1}`}
                        className="rounded-md border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                      />
                    </Form.Item>

                    <Button
                      type="text"
                      danger
                      onClick={() => remove(name)}
                      aria-label={`Remove step ${index + 1}`}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  type="dashed"
                  block
                  onClick={() => add()}
                  className="text-indigo-600 hover:text-indigo-800 border-indigo-400"
                >
                  + Add Step
                </Button>
              </div>
            )}
          </Form.List>

          {/* Other form items unchanged */}
          {/* Image URL */}
          <Form.Item
            name="imageUrl"
            label="Image URL"
            rules={[{ required: true, message: "Please enter image URL" }]}
          >
            <Input placeholder="Paste image URL" />
          </Form.Item>

          {/* Image Caption */}
          <Form.Item name="imageCaption" label="Image Caption">
            <Input placeholder="Optional image caption" />
          </Form.Item>

          {/* Video URL */}
          <Form.Item name="videoPath" label="Video URL">
            <Input placeholder="Paste video URL" />
          </Form.Item>

          {/* Video Description */}
          <Form.Item name="videoDescription" label="Video Description">
            <Input.TextArea rows={2} placeholder="Optional video description" />
          </Form.Item>

          {/* Safety Tip Title */}
          <Form.Item name="safetyTipTitle" label="Safety Tip Title">
            <Input placeholder="Enter safety tip title" />
          </Form.Item>

          {/* Safety Tip Content */}
          <Form.Item name="safetyTipContent" label="Safety Tip Content">
            <Input.TextArea rows={3} placeholder="Enter safety tip content" />
          </Form.Item>

          {/* Order (optional) */}
          <Form.Item name="order" label="Order" rules={[{ required: false }]}>
            <InputNumber
              min={1}
              className="w-full"
              placeholder="Order number (optional)"
            />
          </Form.Item>

          {/* Actions */}
          <Form.Item>
            <Space>
              <Button
                onClick={() => {
                  setMaterialDrawerOpen(false);
                  materialForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </CustomDrawerLayout>
    </div>
  );
};

export default CoursePage;
