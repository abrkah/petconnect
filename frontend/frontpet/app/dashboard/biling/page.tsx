"use client";
import { UserOutlined, SyncOutlined, FileDoneOutlined } from "@ant-design/icons";
import Bilinginvoice from "./-component/bilinginvoice";
import InvoicesTable from "../-componenets/invoice";

const BilingPage = () => {
  const invoices = [
    {
      id: "inv_001",
      invoiceNumber: "INV-2025001",
      customerName: "John Doe",
      date: "2025-05-01",
      dueDate: "2025-05-10",
      amount: 120,
      currency: "USD",
      status: "paid",
      planId: "plan_basic",
      subscriptionId: "sub_001",
    },
    {
      id: "inv_002",
      invoiceNumber: "INV-2025002",
      customerName: "Jane Smith",
      date: "2025-05-03",
      dueDate: "2025-05-13",
      amount: 240,
      currency: "EUR",
      status: "pending",
      planId: "plan_pro",
      subscriptionId: "sub_002",
    },
    {
      id: "inv_003",
      invoiceNumber: "INV-2025003",
      customerName: "Alex Johnson",
      date: "2025-05-05",
      dueDate: "2025-05-15",
      amount: 60,
      currency: "USD",
      status: "unpaid",
      planId: "plan_starter",
      subscriptionId: "sub_003",
    },
  ];

  const dashboardData = [
    {
      id: "totalInvoice",
      overview: "Total Invoice",
      icon: <FileDoneOutlined />,
      color: "#1890ff",
    },
    {
      id: "Paid",
      overview: "Paid",
      icon: <SyncOutlined />,
      color: "#52c41a",
    },
    {
      id: "Non-Paid",
      overview: "Non-Paid",
      icon: <UserOutlined />,
      color: "#faad14",
    },
  ];

  const totalInvoice = invoices.length;
  const paid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const nonPaid = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const dashboardValues = [
    { id: "totalInvoice", value: totalInvoice },
    { id: "Paid", value: `$${paid.toLocaleString()}` },
    { id: "Non-Paid", value: `$${nonPaid.toLocaleString()}` },
  ];

  const isLoading = false;

  return (
    <div className="h-auto w-auto px-6">
      <Bilinginvoice
        dashboardData={dashboardData}
        dashboardValues={dashboardValues}
        isLoading={isLoading}
      />
      <InvoicesTable
        data={invoices.map((inv) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          date: inv.date,
          dueDate: inv.dueDate,
          status: inv.status,
          amount: inv.amount,
        }))}
        loading={isLoading}
        onRowClick={() => {}}
      />
    </div>
  );
};

export default BilingPage;
