
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPayment } from "../../api/paymentApi";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // React StrictMode로 인한 중복 결제 승인 요청 방지
  const confirmStarted = useRef(false);

  useEffect(() => {
    if (confirmStarted.current) {
      return;
    }

    confirmStarted.current = true;

    const handlePaymentConfirm = async () => {
      try {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        console.log("결제 승인 요청:", {
          paymentKey,
          orderId,
          amount,
        });

        if (!paymentKey || !orderId || !amount) {
          throw new Error("결제 정보가 올바르지 않습니다.");
        }

        const response = await confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        console.log("결제 승인 완료:", response);

        setPayment(response);
      } catch (error) {
        console.error("결제 승인 실패 전체:", error);
        console.error("error.response:", error.response);
        console.error("error.message:", error.message);

        setError(
          error.response?.data?.message ||
          error.message ||
          "결제 승인에 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentConfirm();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div>
        <h2>결제 승인 중...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>결제 승인 실패</h2>
        <p>{error}</p>

        <button onClick={() => navigate("/articket")}>
          전시회관으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>결제가 완료되었습니다.</h2>

      {payment && (
        <div>
          <p>주문 번호: {payment.paymentOrderId}</p>
          <p>결제 금액: {payment.paymentAmount.toLocaleString()}원</p>
          <p>결제 상태: {payment.paymentStatus}</p>
          <p>결제 수단: {payment.paymentMethod}</p>
        </div>
      )}

      <button onClick={() => navigate("/articket")}>
        전시회관으로 돌아가기
      </button>
    </div>
  );
};

export default PaymentSuccess;
