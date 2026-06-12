import CustomDrawerFooterButton, {
  CustomDrawerFooterButtonProps,
} from "@/components/common/actionbutton/drawer/customdrawerFooterButton";
import CustomDrawerLayout from "@/components/common/actionbutton/drawer";
import CustomDrawerHeader from "@/components/common/actionbutton/drawer/customDrawerHeader";
import { Flex, Form, Input, InputNumber, Spin } from "antd";
import CustomLabel from "@/components/common/actionbutton/form/customLabel/customLable";
import { useTnaManagementCoursePageStore } from "@/app/utils/uistate/fetures/training/managemnet/coursePage";
import React, { useEffect } from "react";
import RemoveFormFieldButton from "@/components/common/forButtons/removeFormFieldButton";
import AddFormFieldsButton from "@/components/common/forButtons/addFormFieldButton";
import { CourseLesson } from "@/app/types/tenant-management/training";
import ActionButtons from "@/components/common/actionbutton/actionButton";
import CourseLessonMaterial from "../../lessonMaterial";
import { useSetCourseLesson } from "@/app/utils/store/server/training/mutation";

const mockLessonData = {
  items: [
    {
      id: "lesson1",
      title: "Mock Lesson Title",
      order: 1,
      description: "This is a mock lesson description.",
      courseLessonMaterials: [
        { id: "material1", title: "Material One" },
        { id: "material2", title: "Material Two" },
      ],
    },
  ],
};

const CourseAddLessonSidebar = () => {
  const {
    isShowAddLesson: isShow,
    setIsShowAddLesson: setIsShow,
    course,
    lesson,
    setLesson,
    refetchCourse,
    isShowLessonMaterial,
    setIsShowLessonMaterial,
    setLessonMaterial,
  } = useTnaManagementCoursePageStore();

  const { mutate: setLessons } = useSetCourseLesson();
 
  const isLoading = false;
  const isFetching = false;
  const isLoadingDelete = false;
  const isSuccess = false;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!isShowLessonMaterial && refetchCourse && lesson) {
      refetchCourse();
    }
  }, [isShowLessonMaterial]);

  // Set form values from mock data when lesson or mockLessonData changes
  useEffect(() => {
    if (lesson && mockLessonData?.items?.length && form) {
      const item = mockLessonData.items[0];
      setLesson(item);
      form.setFieldValue("lessons", [item]);
    }
  }, [lesson, form]);

  const footerModalItems: CustomDrawerFooterButtonProps[] = [
    {
      label: "Cancel",
      key: "cancel",
      className: "h-14",
      size: "large",
      loading: isLoading || isFetching || isLoadingDelete,
      onClick: () => onClose(),
    },
    {
      label: lesson ? "Edit" : "Create",
      key: "create",
      className: "h-14",
      type: "primary",
      size: "large",
      loading: isLoading || isFetching || isLoadingDelete,
      onClick: () => form.submit(),
    },
  ];

  const onClose = () => {
    form.resetFields();
    setLesson(null);
    setIsShow(false);
  };

  const onFinish = () => {
    const value = form.getFieldsValue();
    const lessons: CourseLesson[]= value["lessons"].map((l: any) => ({
      title: l.title,
      order: l.order,
      description: l.description,
      courseId: course?.id ?? "",
    }));
    console.log("Submitting lessons:", lessons);
    setLessons(lessons);
  };

  return (
    isShow && (
      <CustomDrawerLayout
        open={isShow}
        onClose={() => onClose()}
        modalHeader={
          <CustomDrawerHeader className="flex justify-center">
            {lesson ? "Edit" : "Add"} Lesson
          </CustomDrawerHeader>
        }
        footer={
          <CustomDrawerFooterButton
            className="w-1/2 mx-auto"
            buttons={footerModalItems}
          />
        }
        hideButton={isShowLessonMaterial}
        width="50%"
      >
        <Form
          layout="vertical"
          form={form}
          requiredMark={CustomLabel}
          disabled={isLoading || isFetching}
          initialValues={{ lessons: [{}] }}
          onFinish={onFinish}
        >
          <Form.List name="lessons">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <React.Fragment key={key}>
                    <Flex className="w-full" gap={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        label="Enter the Lesson title"
                        rules={[{ required: true, message: "Required" }]}
                        className="form-item flex-1"
                      >
                        <Input id="tnaLessonTitleFieldId" className="control" />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <RemoveFormFieldButton
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      ) : null}
                    </Flex>
                    <Form.Item
                      {...restField}
                      name={[name, "order"]}
                      label="Lesson Number"
                      rules={[{ required: true, message: "Required" }]}
                      className="form-item pl-4"
                    >
                      <InputNumber
                        id="tnaLessonNumberFieldId"
                        className="control-number"
                        placeholder="Enter the order of the lesson in number"
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label="Description"
                      rules={[{ required: true, message: "Required" }]}
                      className="form-item pl-4"
                    >
                      <Input.TextArea
                        id="tnaDescriptionFieldId"
                        className="control-tarea"
                        rows={6}
                        placeholder="Enter the Description"
                      />
                    </Form.Item>
                    {!lesson && (
                      <Form.Item>
                        <div className="my-4 border-t border-gray-200"></div>
                      </Form.Item>
                    )}
                  </React.Fragment>
                ))}

                {!lesson && (
                  <Form.Item>
                    <AddFormFieldsButton
                      label="Add Lesson"
                      onClick={() => {
                        add();
                      }}
                    />
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form>

        {lesson && (
          <>
            {lesson.courseLessonMaterials.map((material) => (
              <Spin spinning={isLoadingDelete} key={material.id}>
                <div className="mt-6">
                  <div className="text-sm text-gray-900 font-medium mb-2.5">
                    Course Material Title
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[54px] px-5 text-sm font-medium text-gray-900 rounded-lg border border-gray-200 bg-gray-100 flex items-center">
                      {material.title}
                    </div>
                    <ActionButtons
                      id={material?.id || null}
                      onEdit={() => {
                        setLessonMaterial(material);
                        setIsShowLessonMaterial(true);
                      }}
                      onDelete={() => {
                        // deleteMaterial([material.id]); // Disabled due to mock
                        console.log("Delete material", material.id);
                      }}
                    />
                  </div>
                </div>
              </Spin>
            ))}

            <CourseLessonMaterial />
          </>
        )}
      </CustomDrawerLayout>
    )
  );
};

export default CourseAddLessonSidebar;
