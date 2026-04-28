"use client";

import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { MdAddCircleOutline } from "react-icons/md";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import UserForm only
const UserForm = dynamic(() => import("./forms/userform"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  user: (type, data) => <UserForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: "user"; // Only "user" allowed now
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = "w-8 h-8";
  const bgColor =
    type === "create"
      ? "bg-blue"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-red-600";

  const [open, setOpen] = useState(false);

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form action="" className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    } else if (type === "create" || type === "update") {
      return forms[table](type, data);
    } else {
      return <div>Form not found!</div>;
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "create":
        return <MdAddCircleOutline className={size} />;
      case "update":
        return <EditOutlined className={size} />;
      case "delete":
        return <DeleteOutlined className={size} />;
      default:
        return null;
    }
  };

  return (
    <>
      <button
        className={`${bgColor} flex items-center justify-center rounded-full`}
        onClick={() => setOpen(true)}
      >
        {renderIcon()}
      </button>

      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <CloseOutlined className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
