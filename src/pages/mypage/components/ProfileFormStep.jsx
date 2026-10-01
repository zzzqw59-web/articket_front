import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import ActionButton from "../../../components/common/ActionButton";
import Badge from "../../../components/common/Badge";
import { AUTH_CONSTANTS } from "../../../constants/authConstants";

const ProfileFormStep = ({
  formData,
  isEditing,
  showFormPassword,
  setShowFormPassword,
  authCode,
  setAuthCode,
  isPhoneVerified,
  onFormChange,
  onStartEdit,
  onCancelEdit,
  onPhoneVerify,
  onUpdateSubmit,
  onWithdrawal,
  renderEyeIcon,
}) => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(AUTH_CONSTANTS.RESEND_TIMER_SECONDS || 180);

  // 회원 탈퇴 동의 관련 모달 상태
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    let timer;
    if (isCodeSent && !isPhoneVerified && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, isPhoneVerified, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendCode = () => {
    if (!formData.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    setIsCodeSent(true);
    setTimeLeft(AUTH_CONSTANTS.RESEND_TIMER_SECONDS || 180);
    alert("인증번호가 발송되었습니다. (테스트용)");
  };

  // 탈퇴 확정 클릭
  const handleConfirmWithdrawal = () => {
    if (!isAgreed) {
      alert("탈퇴 동의 체크박스에 동의해 주세요.");
      return;
    }
    setShowWithdrawModal(false);
    onWithdrawal();
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <PageHeader
        title="회원 정보 관리"
        description="회원님의 개인정보를 조회하고 수정할 수 있습니다."
      />

      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-6">
        {/* 프로필 요약 카드 */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
            회원
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-gray-900">
                {formData.nickname} 님
              </span>
              {/* 💡 하드코딩 문구 제거 및 권한(Role) 기반 동적 배지 바인딩 */}
              <Badge variant={formData.role || formData.memberRole || "USER"} />
            </div>
            <div className="text-xs text-gray-400 flex flex-col gap-0.5">
              <span>가입일 : {formData.createdAt || "2026년 9월 17일"}</span>
            </div>
          </div>
        </div>

        {/* 회원 정보 폼 */}
        <form onSubmit={onUpdateSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">이메일</label>
            <input
              type="email"
              value={formData.email || ""}
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded cursor-default"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">비밀번호</label>
            <div className="relative w-full">
              <input
                type={isEditing ? (showFormPassword ? "text" : "password") : "password"}
                name="password"
                placeholder={isEditing ? "변경할 비밀번호를 입력해 주세요" : "••••••••••••"}
                value={isEditing ? formData.password : "••••••••••••"}
                onChange={onFormChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 pr-10 text-sm border rounded transition-colors ${
                  isEditing
                    ? "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-default"
                }`}
              />
              {isEditing && renderEyeIcon(showFormPassword, () => setShowFormPassword(!showFormPassword))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname || ""}
              onChange={onFormChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 text-sm border rounded transition-colors ${
                isEditing
                  ? "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                  : "border-gray-200 bg-gray-50 text-gray-500 cursor-default"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">이름</label>
            <input
              type="text"
              value={formData.name || ""}
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded cursor-default"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">전화번호</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={onFormChange}
                disabled={!isEditing || isPhoneVerified}
                className={`flex-1 px-3 py-2 text-sm border rounded transition-colors ${
                  isEditing
                    ? "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-default"
                }`}
              />
              {isEditing && !isPhoneVerified && (
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="px-4 py-2 text-xs bg-gray-800 text-white rounded font-medium hover:bg-gray-700 whitespace-nowrap transition-colors"
                >
                  {isCodeSent ? "재전송" : "인증번호 전송"}
                </button>
              )}
            </div>
          </div>

          {isEditing && isCodeSent && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700">인증번호 입력</label>
                {!isPhoneVerified && (
                  <span className="text-[11px] font-bold text-red-500">
                    유효시간 {formatTime(timeLeft)}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`인증번호 ${AUTH_CONSTANTS?.SMS_CODE_LENGTH || 6}자리`}
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  disabled={isPhoneVerified || timeLeft === 0}
                  maxLength={AUTH_CONSTANTS?.SMS_CODE_LENGTH || 6}
                  className={`flex-1 px-3 py-2 text-xs border rounded transition-colors placeholder:text-gray-300 ${
                    isPhoneVerified
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={onPhoneVerify}
                  disabled={isPhoneVerified || timeLeft === 0}
                  className={`px-4 py-2 text-xs rounded font-medium whitespace-nowrap transition-colors ${
                    isPhoneVerified
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  }`}
                >
                  {isPhoneVerified ? "인증완료" : "인증하기"}
                </button>
              </div>
            </div>
          )}

          {/* 하단 액션 버튼 */}
          <div className="mt-4 flex flex-col gap-3">
            {isEditing ? (
              <div className="flex justify-center gap-3">
                <ActionButton
                  label="취소"
                  variant="secondary"
                  type="button"
                  onClick={onCancelEdit}
                />
                <ActionButton
                  label="저장"
                  variant="primary"
                  type="submit"
                />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onStartEdit}
                  className="w-full py-2.5 bg-amber-600 text-white rounded-md font-medium text-sm hover:bg-amber-700 transition-colors shadow-sm"
                >
                  회원 정보 수정
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAgreed(false);
                    setShowWithdrawModal(true);
                  }}
                  className="w-full py-2.5 bg-red-600 text-white font-bold rounded-md text-sm hover:bg-red-700 active:bg-red-800 transition-colors shadow-sm"
                >
                  회원 탈퇴
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* 회원 탈퇴 확인 및 동의 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 flex flex-col gap-4 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 border-gray-100">
              {AUTH_CONSTANTS.WITHDRAWAL_CONFIRM_TITLE}
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 font-medium">
              {AUTH_CONSTANTS.WITHDRAWAL_WARNING_MESSAGE}
            </p>

            <label className="flex items-center gap-2 cursor-pointer mt-2 select-none">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-xs font-semibold text-gray-800">
                {AUTH_CONSTANTS.WITHDRAWAL_CHECKBOX_LABEL}
              </span>
            </label>

            <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                disabled={!isAgreed}
                className={`px-4 py-2 text-xs rounded font-bold text-white transition-colors ${
                  isAgreed
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                탈퇴 진행
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFormStep;