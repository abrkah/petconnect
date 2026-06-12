"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Table, Input, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { Search } = Input;
const { RangePicker } = DatePicker;

type InvoiceStatus = string; // now dynamic

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string; // ISO date string
  dueDate: string; // ISO date string
  paymentDate?: string | null; // ISO date or null
  status: InvoiceStatus;
  amount: number;
}

interface InvoicesTableProps {
  data: Invoice[];
  loading: boolean;
  onRowClick: (id: string) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
  data = [],
  loading,
  onRowClick,
}) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus[]>([]);
  const [paymentDateRange, setPaymentDateRange] = useState<
    [Dayjs, Dayjs] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Generate dynamic status options from the data
  const statusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(data.map((inv) => inv.status)));
    return uniqueStatuses.map((status) => ({ label: status, value: status }));
  }, [data]);

  // Filtered data
  const filteredData = data.filter((invoice) => {
    if (
      searchText &&
      !invoice.invoiceNumber.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;
    if (statusFilter.length && !statusFilter.includes(invoice.status))
      return false;
    if (paymentDateRange) {
      const paymentDate = invoice.paymentDate
        ? dayjs(invoice.paymentDate)
        : null;
      if (
        !paymentDate ||
        paymentDate.isBefore(paymentDateRange[0], "day") ||
        paymentDate.isAfter(paymentDateRange[1], "day")
      )
        return false;
    }
    return true;
  });

  // Reset page when filters change
  useEffect(
    () => setCurrentPage(1),
    [searchText, statusFilter, paymentDateRange]
  );

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice ID",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      sorter: (a, b) =>
        a.paymentDate && b.paymentDate
          ? dayjs(a.paymentDate).unix() - dayjs(b.paymentDate).unix()
          : 0,
      render: (date?: string | null) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "-",
    },
    {
      title: "Payment Status",
      dataIndex: "status",
      key: "status",
      render: (status: InvoiceStatus) => (
        <span
          className={`${
            status.toLowerCase() === "paid"
              ? "text-green-600"
              : status.toLowerCase() === "unpaid"
              ? "text-gray-600"
              : status.toLowerCase() === "overdue"
              ? "text-red-600"
              : "text-gray-400"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      align: "center",
      render: (id: string) => (
        <button
          onClick={() => onRowClick(id)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
          aria-label={`View details for invoice ${id}`}
          type="button"
        >
          <EyeOutlined className="text-gray-600 hover:text-blue-600 text-sm" />
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 mt-8 flex-wrap">
        <Search
          placeholder="Search by Invoice ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ maxWidth: 600 }}
        />
        <Select
          placeholder="Filter by Payment Status"
          mode="multiple"
          allowClear
          style={{ width: 220 }}
          options={statusOptions}
          value={statusFilter}
          onChange={(values) => setStatusFilter(values as InvoiceStatus[])}
        />
        <RangePicker
          allowClear
          value={paymentDateRange}
          onChange={(dates) =>
            setPaymentDateRange(dates as [Dayjs, Dayjs] | null)
          }
          placeholder={["Payment Date From", "Payment Date To"]}
          style={{ width: 250 }}
          disabledDate={(current) => current && current > dayjs().endOf("day")}
        />
      </div>

      {/* Table */}
      <Table<Invoice>
        dataSource={filteredData}
        columns={columns}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: filteredData.length,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15", "20"],
          onChange: handlePageChange,
        }}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onRowClick(record.id),
          style: { cursor: "pointer" },
        })}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default InvoicesTable;
