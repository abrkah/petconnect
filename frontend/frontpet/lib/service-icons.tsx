import {
  MedicineBoxOutlined,
  CompassOutlined,
} from "@ant-design/icons";

export function serviceTypeIcon(serviceType: string) {
  const t = serviceType?.toUpperCase() || "";
  if (t.includes("VACCINATION") || t.includes("VAC")) {
    return <MedicineBoxOutlined className="text-lg text-cyan-600" />;
  }
  if (t.includes("WALK")) {
    return <span className="text-lg" aria-hidden>🐕</span>;
  }
  return <CompassOutlined className="text-lg text-teal-600" />;
}

export function serviceTypeLabel(serviceType: string) {
  const map: Record<string, string> = {
    DOG_WALKING: "Dog walking",
    VACCINATION: "Vaccination",
    GENERAL_SERVICE: "General care",
  };
  return map[serviceType] || serviceType.replace(/_/g, " ").toLowerCase();
}
