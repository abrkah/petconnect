"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { message } from "antd";
import { useSetPayment } from "@/app/utils/store/server/payment/mutation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const router = useRouter();

  const { mutate: savePayment } = useSetPayment();

  useEffect(() => {
    if (!tx_ref) {
      message.error("Missing transaction reference");
      router.push("/dashboard/traninig");
      return;
    }

    const userId = localStorage.getItem("userId");
    const courseId = localStorage.getItem("selectedCourse");
    const amountStr = localStorage.getItem("paymentAmount");
    const amount = amountStr ? Number(amountStr) : 0;

    if (!userId || !courseId || !amount) {
      message.error("Missing payment data");
      router.push("/dashboard/traninig");
      return;
    }

    // Optionally verify payment status here with backend or Chapa API before saving

    savePayment(
      { userId, courseId, amount },
      {
        onSuccess() {
          message.success("Payment recorded successfully!");
          localStorage.removeItem("userId");
          localStorage.removeItem("selectedCourse");
          localStorage.removeItem("paymentAmount");
          router.push("/dashboard/traninig");
        },
        onError() {
          message.error("Failed to save payment.");
          router.push("/dashboard/traninig");
        },
      }
    );
  }, [tx_ref, router, savePayment]);

  return <div>Processing payment...</div>;
}
