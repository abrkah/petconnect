import { Button, Drawer } from "antd";
import React from "react";
import { FaAngleRight } from "react-icons/fa";
import { MdClose } from "react-icons/md";

interface CustomDrawerLayoutProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string | number; // Optional width prop
}

const CustomDrawerLayout: React.FC<CustomDrawerLayoutProps> = ({
  open,
  onClose,
  title,
  children,
  width,
}) => {
  const modalHeader = (
    <div className="flex justify-between text-xl font-bold text-gray-800 p-2 ">
      {title}
      <MdClose onClick={onClose} className="cursor-pointer" size={20} />
    </div>
  );

  return (
    <div>
      {open && (
        <Button
          id="closeSidebarButton"
          className="bg-white text-lg text-grey-9 rounded-full"
          icon={<FaAngleRight />}
          onClick={onClose}
          style={{
            display:
              typeof window !== "undefined" && window.innerWidth <= 768
                ? "none"
                : "flex",
            position: "fixed",
            right: width ? "43%" : "52%",
            width: "50px",
            height: "50px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1001,
          }}
        />
      )}
      <Drawer
        title={modalHeader}
        width={
          typeof window !== "undefined" && window.innerWidth <= 768
            ? "90%"
            : width
            ? width
            : "30%"
        }
        closable={false}
        onClose={onClose}
        open={open}
      >
        {children}
      </Drawer>
    </div>
  );
};

export default CustomDrawerLayout;
