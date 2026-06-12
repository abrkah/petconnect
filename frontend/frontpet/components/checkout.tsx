"use client";

import React, { useState } from "react";
import { Button, Card, Typography, Input, Form, Alert, Space } from "antd";
import usePaymentStore from "@/app/utils/uistate/fetures/payment/paymentStore";
import { initializeChapaPayment } from "@/app/utils/chapa"; 

const { Title } = Typography;

function CheckoutPage({ totalPrice }) {
  const { formData, amount, setFormData } = usePaymentStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async (values: any) => {
    setLoading(true);
    setErrorMessage(null);

    // Update store with form values
    setFormData({
      ...formData,
      paymentPersonName: values.fullName,
      paymentPersonEmail: values.email,
      paymentPersonPhoneNumber: values.phone,
    });

    try {
      initializeChapaPayment({
        amount: amount.toFixed(2),
        email: values.email,
        first_name: values.fullName,
        last_name: "",
        phone: values.phone,
      });
    } catch (err) {
      setErrorMessage("An error occurred while initiating payment.");
    }

    setLoading(false);
  };

  const formatNumber = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  return (
    <div className="checkout-container" style={{ padding: "20px" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card
          title={<Title level={3}>Payment Details</Title>}
        
          style={{ width: "100%", maxWidth: "600px", margin: "auto" }}
        >
          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon closable />
          )}

          <Form
            layout="vertical"
            form={form}
            onFinish={handlePayment}
            initialValues={{
              fullName: formData.paymentPersonName,
              email: formData.paymentPersonEmail,
              phone: formData.paymentPersonPhoneNumber,
            }}
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                onClick={handlePayment}
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  backgroundColor: "primary",
                  borderColor: "#000",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  padding: "12px",
                  marginTop: "10px",
                }}
              >
                Pay {formatNumber(totalPrice)} ETB
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
}

export default CheckoutPage;
