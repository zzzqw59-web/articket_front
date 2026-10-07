import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import ActionButton from "../../../components/common/ActionButton";
import Badge from "../../../components/common/Badge";
import { AUTH_CONSTANTS, VERIFICATION_TYPE } from "../../../constants/authConstants";
import { WITHDRAW_STATUS } from "../../../constants/config";
import { sendPhoneVerification, verifyPhoneVerification } from "../../../api/authApi";

const ProfileFormStep = ({
  formData,
  isEditing,
  showFormPassword,
  setShowFormPassword,
  authCode,
  setAuthCode,
  isPhoneVerified,
  withdrawInfo, 
  onCancelWithdrawal,
  onFormChange,
  onStartEdit,
  onCancelEdit,
  onPhoneVerify,
  onUpdateSubmit,
  onWithdrawal,
  renderEyeIcon,
}) => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(AUTH_CONSTANTS?.RESEND_TIMER_SECONDS || 180);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 탈퇴 대기 상태 여부 판단
  const isPendingWithdrawal =
    withdrawInfo &&
    (withdrawInfo.withdrawStatus === WITHDRAW_STATUS.IN_PROGRESS ||
     withdrawInfo.status === WITHDRAW_STATUS.IN_PROGRESS);

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

  /**
   * 인증번호 발송 요청
   * Request DTO: VerificationSendRequestDTO { phone, type }
   */
  const handleSendCode = async () => {
    if (!formData.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    try {
      setIsSending(true);

      // VerificationSendRequestDTO 필드명(phone, type)에 맞춘 객체전송
      await sendPhoneVerification({
        phone: formData.phone,
        type: VERIFICATION_TYPE?.PHONE_CHANGE || "PHONE_CHANGE",
      });

      setIsCodeSent(true);
      setTimeLeft(AUTH_CONSTANTS?.RESEND_TIMER_SECONDS || 180);
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      console.error("인증번호 발송 실패:", error);
      alert(error.response?.data?.message || "인증번호 발송에 실패했습니다. 전화번호를 확인해 주세요.");
    } finally {
      setIsSending(false);
    }
  };

  /**
   * 인증번호 검증 요청
   * Request DTO: VerificationVerifyRequestDTO { phone, code, type }
   */
  const handleVerifyCode = async () => {
    const codeLength = AUTH_CONSTANTS?.SMS_CODE_LENGTH || 6;
    if (!authCode || authCode.length !== codeLength) {
      alert(`인증번호 ${codeLength}자리를 정확히 입력해 주세요.`);
      return;
    }

    try {
      setIsVerifying(true);

      // VerificationVerifyRequestDTO 필드명(phone, code, type)에 맞춘 객체전송
      await verifyPhoneVerification({
        phone: formData.phone,
        code: authCode,
        type: VERIFICATION_TYPE?.PHONE_CHANGE || "PHONE_CHANGE",
      });

      alert(AUTH_CONSTANTS?.MSG_PHONE_VERIFIED_SUCCESS || "전화번호 인증이 완료되었습니다.");
      
      if (onPhoneVerify) {
        onPhoneVerify(); // 부모 컴포넌트에 전화번호 인증 성공 알림
      }
    } catch (error) {
      console.error("인증번호 검증 실패:", error);
      alert(error.response?.data?.message || "인증번호가 일치하지 않거나 만료되었습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <PageHeader
        title="회원 정보 관리"
        description="회원님의 개인정보를 조회하고 수정할 수 있습니다."
      />

      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-6">
        
        {/* 탈퇴 진행 중 안내 배너 */}
        {isPendingWithdrawal && (
          <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-lg flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-amber-500 text-white rounded-full mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex flex-col text-xs text-amber-900 gap-1">
                <span className="font-bold text-sm">현재 회원 탈퇴가 진행 중입니다.</span>
                <span>신청일: {withdrawInfo?.withdrawRequestAt || "조회 중"}</span>
                <span>삭제 예정일: {withdrawInfo?.withdrawDue || withdrawInfo?.dueData || "유예 기간 내"}</span>
                <span className="text-amber-700 mt-1">유예 기간 동안은 언제든지 탈퇴를 철회하실 수 있습니다.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancelWithdrawal}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded transition-colors shadow-sm"
            >
              회원 탈퇴 신청 취소 (계정 복구)
            </button>
          </div>
        )}

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
              <Badge variant={formData.role || formData.memberRole || "USER"} />
            </div>
            <div className="text-xs text-gray-400 flex flex-col gap-0.5">
              <span>가입일 : {formData.joinCreatedAt || "조회 중..."}</span>
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
                  disabled={isSending}
                  className="px-4 py-2 text-xs bg-gray-800 text-white rounded font-medium hover:bg-gray-700 disabled:bg-gray-400 whitespace-nowrap transition-colors"
                >
                  {isSending ? "발송 중..." : isCodeSent ? "재전송" : "인증번호 전송"}
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
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 cursor-not-allowed"
                      : "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isPhoneVerified || timeLeft === 0 || isVerifying}
                  className={`px-4 py-2 text-xs rounded font-medium whitespace-nowrap transition-colors ${
                    isPhoneVerified
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-400"
                  }`}
                >
                  {isVerifying ? "확인 중..." : isPhoneVerified ? "인증완료" : "인증하기"}
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
              !isPendingWithdrawal && (
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
                    onClick={onWithdrawal}
                    className="w-full py-2.5 bg-red-600 text-white font-bold rounded-md text-sm hover:bg-red-700 active:bg-red-800 transition-colors shadow-sm"
                  >
                    회원 탈퇴
                  </button>
                </>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileFormStep;