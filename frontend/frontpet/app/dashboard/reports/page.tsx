"use client";

import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const Reports = () => {
  return (
    <Card>
      <Title level={2}>Reports</Title>
      <p>This is the reports page with static data.</p>
    </Card>
  );
};

export default Reports;
