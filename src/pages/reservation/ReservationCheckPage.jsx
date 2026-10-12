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

  // 예약 정보 조회 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>예약 정보를 확인하고 있습니다...</p>
      </div>
    );
  }

  // 예약 조회 실패
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // 예약 정보가 없는 경우
  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-500">예약 정보가 없습니다.</p>
      </div>
    );
  }

  // 예약 확정 상태가 아니면 입장 정보 표시 안 함
  if (reservation.reservationStatus !== "RESERVED") {
    let statusMessage = "예약이 확정되지 않았습니다.";

    if (reservation.reservationStatus === "PENDING") {
      statusMessage = "아직 결제가 완료되지 않은 예약입니다.";
    } else if (reservation.reservationStatus === "CANCELED") {
      statusMessage = "취소된 예약입니다.";
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            예약 확인
          </h1>

          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
              {reservation.reservationStatus}
            </span>
          </div>

          <p className="text-gray-700 font-medium mb-2">
            {statusMessage}
          </p>

          <p className="text-sm text-gray-400 leading-relaxed">
            예약이 확정된 경우에만 입장할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // 예약 확정 상태일 때만 예약 정보 표시
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-center mb-6">
          예약 확인
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">전시명</p>
            <p className="font-medium">
              {reservation.exhibitionTitle}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">전시 장소</p>
            <p className="font-medium">
              {reservation.exhibitionArea}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">관람일</p>
            <p className="font-medium">
              {reservation.reservationDay}
            </p>
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
            <p className="font-medium text-green-600">
              예약 확정
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCheckPage;