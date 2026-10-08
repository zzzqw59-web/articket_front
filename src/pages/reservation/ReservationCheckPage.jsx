import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReservationByOrderId } from "../../api/reservationApi";

const ReservationCheckPage = () => {
  const { orderId } = useParams();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const data = await getReservationByOrderId(orderId);
        setReservation(data);
      } catch (error) {
        console.error("예약 조회 실패:", error);
        setError("예약 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchReservation();
    } else {
      setError("예약 번호가 없습니다.");
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>예약 정보를 확인하고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-center mb-6">
          예약 확인
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">전시명</p>
            <p className="font-medium">{reservation.exhibitionTitle}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">전시 장소</p>
            <p className="font-medium">{reservation.exhibitionArea}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">관람일</p>
            <p className="font-medium">{reservation.reservationDay}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">예약 인원</p>
            <p className="font-medium">
              {reservation.reservationPerson}명
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">예약 번호</p>
            <p className="font-medium break-all">
              {reservation.reservationOrderId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">결제 금액</p>
            <p className="font-medium">
              {reservation.reservationAmount?.toLocaleString()}원
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">예약 상태</p>
            <p className="font-medium">{reservation.reservationStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCheckPage;
