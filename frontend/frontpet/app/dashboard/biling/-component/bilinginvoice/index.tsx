import React, { ReactElement } from "react";
import { Card, Skeleton } from "antd";

interface DashboardItem {
  id: string;
  overview: string;
  icon: ReactElement;
  color: string;
}

interface DashboardValue {
  id: string;
  value: string | number;
}

interface BillingInvoiceProps {
  dashboardData: DashboardItem[];
  dashboardValues: DashboardValue[];
  isLoading: boolean;
}

const BillingInvoice: React.FC<BillingInvoiceProps> = ({
  dashboardData,
  dashboardValues,
  isLoading,
}) => {
  return (
    <div className="grid gap-8 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {dashboardData.map((item, index) => {
        const valueData = dashboardValues.find((v) => v.id === item.id);

        return (
          <Card
            key={index}
            loading={isLoading}
            className="transition-all duration-300 hover:shadow-lg rounded-xl"
            style={{
              borderLeft: `5px solid ${item.color}`,
              boxShadow: isLoading
                ? "none"
                : "0px 5px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-md text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {React.cloneElement(
                    item.icon as React.ReactElement<{ style?: React.CSSProperties }>,
                    {
                      style: { fontSize: 20, color: "#fff" },
                    },
                  )}
                </div>
                <div>
                  <div className="text-gray-600 text-sm">{item.overview}</div>
                  <div className="text-xl font-semibold">
                    {valueData?.value ?? "—"}
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default BillingInvoice;
