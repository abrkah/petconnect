import { Button } from "antd";
import React from "react";

interface ButtonComponentProps {
  onClick: () => void;
  icon?: React.ReactNode; // Optional icon prop
  children: React.ReactNode; // Content inside the button
  className?: string; // Optional className for custom styles
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  onClick,
  icon,
  children,
  className,
}) => (
  <Button onClick={onClick} className={className} icon={icon}>
    {children}
  </Button>
);

export default ButtonComponent;
