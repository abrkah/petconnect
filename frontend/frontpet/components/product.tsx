"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useGetProducts } from "@/app/utils/store/server/product/query";
import { Modal, Card, Button, message } from "antd";
import { initializeChapaPayment } from "@/app/utils/chapa";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
};

const parsePrice = (price: string) => parseFloat(price.replace("$", ""));

const PetProductsPage: React.FC = () => {
  const { data: products = [], isLoading } = useGetProducts();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [orderItems, setOrderItems] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleOrderSelected = () => {
    const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
    const items = selectedProducts.map((product) => ({ product, quantity: 1 }));
    setOrderItems(items);
    setIsModalOpen(true);
  };

  const handleRemoveItem = (id: number) => {
    setOrderItems((prev) => prev.filter((item) => item.product.id !== id));
    setSelectedIds((prev) => prev.filter((pid) => pid !== id));
  };

  const totalPrice = orderItems.reduce(
    (total, item) => total + parsePrice(item.product.price) * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPay = () => {
    setIsModalOpen(false);
    setIsPaymentModalVisible(true);
  };

  const closePaymentModal = () => setIsPaymentModalVisible(false);

  const handlePay = async (id: number) => {
    if (!orderItems.length) {
      message.error("No items in the order.");
      return;
    }

    const [first_name, ...lastNameParts] = formData.fullName.split(" ");
    const last_name = lastNameParts.join(" ") || "-";

    try {
      await initializeChapaPayment({
        amount: totalPrice.toString(),
        email: formData.email,
        first_name,
        last_name,
        phone: formData.phoneNumber,
        selectedCourse: id.toString(),
      });
    } catch (err) {
      console.error(err);
      message.error("Payment initialization failed.");
    }
  };

  return (
    <main className="relative w-full border border-blue-100 dark:border-neutral-700 rounded-2xl overflow-hidden pb-20 pt-24 px-4 md:px-12 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(59,130,246,0.4)] hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-100 hover:to-blue-50">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center text-slate-900"
      >
        Pet Care Essentials
      </motion.h2>

      <div className="text-center mb-8">
        <button
          disabled={selectedIds.length === 0}
          onClick={handleOrderSelected}
          className={`px-5 py-2 rounded font-medium transition-colors ${
            selectedIds.length > 0
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Order Selected ({selectedIds.length})
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              onClick={() => toggleSelect(product.id)}
              className={`relative bg-white border rounded-xl shadow-sm flex flex-col items-center p-4 hover:shadow-md transition-shadow cursor-pointer ${
                selectedIds.includes(product.id)
                  ? "border-2 border-indigo-500"
                  : "border-gray-200"
              }`}
            >
              <div className="w-full h-40 bg-gray-100 rounded-md mb-4" />
              <h3 className="text-lg font-semibold mb-1 text-center">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2 text-center">
                {product.description}
              </p>
              <span className="font-bold text-indigo-700">{product.price}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 flex flex-col"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-semibold mb-6 text-indigo-700 text-center">
              Your Order
            </h3>

            <div className="flex-1 space-y-4 max-h-[60vh] overflow-y-auto">
              {orderItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">
                      {item.product.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">x{item.quantity}</span>
                    <span className="font-semibold text-indigo-600">
                      $
                      {(parsePrice(item.product.price) * item.quantity).toFixed(
                        2
                      )}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {orderItems.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No products in your order.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end items-center gap-6 font-bold text-lg">
              <span>Total:</span>
              <span className="text-indigo-700">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                disabled={orderItems.length === 0}
                onClick={handleProceedToPay}
                className={`px-5 py-2 rounded transition ${
                  orderItems.length > 0
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Proceed To Pay
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      {/* Payment Modal */}
      <Modal
        open={isPaymentModalVisible}
        onCancel={closePaymentModal}
        footer={null}
        centered
        width={550}
      >
        <Card
          title={
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Payment Details
            </h2>
          }
          className="shadow-none bg-transparent"
        >
          <div className="space-y-5">
            {["fullName", "email", "phoneNumber"].map((name) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {name === "fullName"
                    ? "Full Name"
                    : name === "email"
                    ? "Email"
                    : "Phone Number"}
                </label>
                <input
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="flex items-center text-sm">
              <input
                type="checkbox"
                defaultChecked
                className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>
                I agree to the{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  Terms & Conditions
                </span>
              </span>
            </div>

            <Button
              block
              size="large"
              onClick={() => handlePay(orderItems[0]?.product.id)}
              className="bg-[#3b36ff] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md"
            >
              Pay {totalPrice.toFixed(2)} ETB
            </Button>
          </div>
        </Card>
      </Modal>
    </main>
  );
};

export default PetProductsPage;
