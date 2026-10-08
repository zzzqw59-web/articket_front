import { useState } from "react";
import ActionButton from "../../../components/common/ActionButton";
import { CANCEL_REASON_OPTIONS, RESERVATION_CANCEL_REASONS } from "../../../constants/mypageConstants";

const ReservationCancelModal = ({ isOpen, onClose, onSubmit, loading }) => {
  if (!isOpen) return null;

  const [reason, setReason] = useState(RESERVATION_CANCEL_REASONS.PERSONAL);
  const [detail, setDetail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 기타 사유일 경우 필수 입력 검증
    if (reason === RESERVATION_CANCEL_REASONS.OTHER && !detail.trim()) {
      setErrorMsg("기타 취소 사유를 입력해 주세요.");
      return;
    }

    setErrorMsg("");
    onSubmit({
      cancelReason: reason,
      cancelDetail: reason === RESERVATION_CANCEL_REASONS.OTHER ? detail.trim() : "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 mx-4">
        {/* 헤더 */}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-gray-900">예약 취소</h3>
          <p className="text-xs text-gray-500">
            취소 사유를 선택해 주세요. 취소 완료 후 환불 규정에 따라 환불이 진행됩니다.
          </p>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">취소 사유</label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg("");
              }}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-amber-600 bg-white"
            >
              {CANCEL_REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 기타 선택 시에만 입력창 활성화 */}
          {reason === RESERVATION_CANCEL_REASONS.OTHER && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">
                상세 사유 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={detail}
                onChange={(e) => {
                  setDetail(e.target.value);
                  if (e.target.value.trim()) setErrorMsg("");
                }}
                maxLength={500}
                placeholder="취소 사유를 상세히 입력해 주세요 (최대 500자)"
                rows={3}
                className="w-full text-xs p-2.5 border border-gray-200 rounded resize-none focus:outline-none focus:border-amber-600"
              />
            </div>
          )}

          {/* 에러 메시지 */}
          {errorMsg && (
            <span className="text-[11px] text-red-500">{errorMsg}</span>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 mt-2">
            <ActionButton
              type="button"
              label="취소"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-1.5 text-xs"
            />
            <ActionButton
              type="submit"
              label={loading ? "처리 중..." : "예약 취소 확정"}
              variant="primary"
              disabled={loading}
              className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 border-red-600 text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationCancelModal;