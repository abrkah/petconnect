"use client";
import React from "react";
import { Pagination, Select, Table } from "antd";

type ColumnType = {
  title: string;
  dataIndex: string;
  key?: string;
  className?: string;
  [key: string]: any;
};

type TableComponentProps = {
  columns: ColumnType[];
  data: any[];
  pagination?: boolean;
  scroll?: number;
};

export const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  data,
  pagination = true,
  scroll = 2000,
}) => {
  const [current, setCurrent] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value, 10));
    setCurrent(1);
  };

  const onChange = (page: number) => {
    setCurrent(page);
  };

  const startIndex = (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data?.length || 0);
  const currentData = data?.slice(startIndex, endIndex);
  const dataLength = data?.length || 0;

  return (
    <div>
      <Table
        columns={columns.map((column) => ({
          ...column,
          className: "custom-table text-sm",
        }))}
        dataSource={currentData}
        scroll={{ x: scroll }}
        pagination={false}
        rowClassName={() => "h-10"}
        // className="shadow-sm text-sm custom-scrollbar"
      />
      {pagination && (
        <div className="p-4 font-lexend">
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <span className="text-xs">Showing:</span>
              <Select
                value={pageSize.toString()}
                onChange={handlePageSizeChange}
                className="w-16 h-7 ml-4"
              >
                {[5, 10, 20, 50].map((size) => (
                  <Select.Option key={size} value={size.toString()}>
                    {size}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <span className="text-center text-xs">
              Showing {startIndex + 1} to {endIndex} of {dataLength} items
            </span>
            <div className="flex items-center">
              <Pagination
                current={current}
                pageSize={pageSize}
                total={dataLength}
                onChange={onChange}
                className="ml-4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
