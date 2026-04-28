"use client";
import {
  CalendarFilled,
  UserOutlined,
  SyncOutlined,
  FileImageFilled,
  FileDoneOutlined,
} from "@ant-design/icons";
import Bilinginvoice from "./-component/bilinginvoice";
import InvoicesTable from "../-componenets/invoice";
import { useGetInvoices } from "@/app/utils/store/server/payment/query";

const BilingPage = () => {
  const { data: fetchedInvoices } = useGetInvoices();
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

  const plans = [
    { id: "plan_starter", name: "Starter Plan", price: 60 },
    { id: "plan_basic", name: "Basic Plan", price: 120 },
    { id: "plan_pro", name: "Pro Plan", price: 240 },
  ];

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
  ];

  const subscriptions = [
    {
      id: "sub_001",
      user: "John Doe",
      planId: "plan_basic",
      startDate: "2025-04-01",
    },
    {
      id: "sub_002",
      user: "Jane Smith",
      planId: "plan_pro",
      startDate: "2025-04-05",
    },
    {
      id: "sub_003",
      user: "Alex Johnson",
      planId: "plan_starter",
      startDate: "2025-04-10",
    },
  ];

  // Example data for dashboard cards
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
const totalInvoice = fetchedInvoices?.length || 0;

const paid =
  fetchedInvoices
    ?.filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.amount, 0) || 0;

const nonPaid =
  fetchedInvoices
    ?.filter((inv) => inv.status !== "PAID")
    .reduce((sum, inv) => sum + inv.amount, 0) || 0;
 const dashboardValues = [
   { id: "totalInvoice", value: totalInvoice },
   { id: "Paid", value: `$${paid.toLocaleString()}` },
   { id: "Non-Paid", value: `$${nonPaid.toLocaleString()}` },
 ];

  const isLoading = false; // Set to true to show loading skeleton

  return (
    <div className="h-auto w-auto px-6">
      <Bilinginvoice
        dashboardData={dashboardData}
        dashboardValues={dashboardValues}
        isLoading={isLoading}
      />
      <InvoicesTable
        data={fetchedInvoices}
        loading={isLoading}
        plans={plans}
        currencies={currencies}
        subscriptions={subscriptions}
      />
    </div>
  );
};

export default BilingPage;
