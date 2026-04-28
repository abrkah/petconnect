// utils/chapa.ts
import { message } from "antd";

interface PaymentParams {
  amount: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  selectedCourse: string;
}

export const initializeChapaPayment = async ({
  amount,
  email,
  first_name,
  last_name,
  phone,
  selectedCourse,
}: PaymentParams) => {
  const tx_ref = `tx-${Date.now()}`;
  const callback_url = `${window.location.origin}/payment-success?tx_ref=${tx_ref}`;
  const return_url = `${window.location.origin}/dashboard/traninig`;

  // Save payment details to localStorage so payment-success page can access them
  localStorage.setItem("selectedCourse", selectedCourse);
  localStorage.setItem("paymentAmount", amount);

  const payload = {
    amount,
    currency: "ETB",
    email,
    first_name,
    last_name,
    phone_number: phone,
    tx_ref,
    callback_url,
    return_url,
    customization: {
      title: "Course Payment",
      description: `Payment for ${first_name} ${last_name}`,
    },
  };

  try {
    const res = await fetch("/api/chapa/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.status === "success" && data.data?.checkout_url) {
      window.location.href = data.data.checkout_url; // redirect to Chapa payment page
    } else {
      message.error(data.message || "Failed to initialize Chapa payment");
    }
  } catch (err) {
    console.error("Chapa init error", err);
    message.error("Payment initialization failed.");
  }
};
