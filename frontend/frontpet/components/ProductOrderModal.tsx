// components/ProductOrderModal.tsx
import React from "react";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductOrderModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    quantity: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (product) {
      alert(
        `Order placed:\nProduct: ${product.name}\nQty: ${formData.quantity}\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}`
      );
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-indigo-700">{product.name}</h2>
          <p className="text-gray-600 text-sm">{product.description}</p>
          <p className="text-black font-semibold mt-2">{product.price}</p>
        </div>

        <div className="space-y-3">
          <input
            type="number"
            name="quantity"
            min={1}
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Quantity"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Your Name"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Phone Number"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          >
            Confirm Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductOrderModal;
