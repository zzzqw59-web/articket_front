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
  phoneVerifiedUntil,
  onFormChange,
  onStartEdit,
  onCancelEdit,
  onSendPhoneCode,
  onPhoneVerify,
  onUpdateSubmit,
  onWithdrawal,
  renderEyeIcon,
}) => {
  const [isCodeSent, setIsCodeSent] =
    useState(false);

  const [codeExpiresAt, setCodeExpiresAt] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!isCodeSent && !isPhoneVerified) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isCodeSent, isPhoneVerified]);

  const timeLeft = Math.max(0, Math.ceil((codeExpiresAt - now) / 1000));
  const verifiedTimeLeft = Math.max(0, Math.ceil((phoneVerifiedUntil - now) / 1000));

  const formatJoinDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (seconds) => {
    const mins =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    return `${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleSendCode = async () => {
    setIsCodeSent(false);
    setCodeExpiresAt(0);

    const requestStartedAt = Date.now();
    const sent =
      await onSendPhoneCode();

    if (!sent) {
      return;
    }

    const currentTime = Date.now();
    setNow(currentTime);
    setIsCodeSent(true);
    setCodeExpiresAt(
      requestStartedAt + AUTH_CONSTANTS.RESEND_TIMER_SECONDS * 1000
    );
  };

  const handlePhoneChange = (e) => {
    setIsCodeSent(false);
    setCodeExpiresAt(0);

    onFormChange(e);
  };

  const handleStartEdit = () => {
    setIsCodeSent(false);
    setCodeExpiresAt(0);

    onStartEdit();
  };

  const handleCancelEdit = () => {
    setIsCodeSent(false);
    setCodeExpiresAt(0);

    onCancelEdit();
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <PageHeader
        title="회원 정보 관리"
        description="회원님의 개인정보를 조회하고 수정할 수 있습니다."
      />

      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
            회원
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-gray-900">
                {formData.nickname} 님
              </span>

              <Badge
                variant={
                  formData.memberType ||
                  "MEMBER"
                }
              />
            </div>

            <div className="text-xs text-gray-400 flex flex-col gap-0.5">
              <span>
                가입일 :{" "}
                {formatJoinDate(formData.joinCreatedAt)}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={onUpdateSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              이메일
            </label>

            <input
              type="email"
              value={formData.email || ""}
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded cursor-default"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              비밀번호
            </label>

            <div className="relative w-full">
              <input
                type={
                  isEditing
                    ? showFormPassword
                      ? "text"
                      : "password"
                    : "password"
                }
                name="password"
                placeholder={
                  isEditing
                    ? "변경할 비밀번호를 입력해 주세요"
                    : "••••••••••••"
                }
                value={
                  isEditing
                    ? formData.password
                    : "••••••••••••"
                }
                onChange={onFormChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 pr-10 text-sm border rounded transition-colors ${
                  isEditing
                    ? "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-default"
                }`}
              />

              {isEditing &&
                renderEyeIcon(
                  showFormPassword,
                  () =>
                    setShowFormPassword(
                      !showFormPassword
                    )
                )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              닉네임
            </label>

            <input
              type="text"
              name="nickname"
              value={
                formData.nickname || ""
              }
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
            <label className="text-xs font-semibold text-gray-700">
              이름
            </label>

            <input
              type="text"
              value={formData.name || ""}
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded cursor-default"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              전화번호
            </label>

            <div className="flex gap-2 items-center">
              <input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                name="phone"
                value={
                  formData.phone || ""
                }
                onChange={
                  handlePhoneChange
                }
                disabled={
                  !isEditing ||
                  isPhoneVerified
                }
                className={`flex-1 px-3 py-2 text-sm border rounded transition-colors ${
                  isEditing
                    ? "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-default"
                }`}
              />

              {isEditing &&
                !isPhoneVerified && (
                  <button
                    type="button"
                    onClick={
                      handleSendCode
                    }
                    className="px-4 py-2 text-xs bg-gray-800 text-white rounded font-medium hover:bg-gray-700 whitespace-nowrap transition-colors"
                  >
                    {isCodeSent
                      ? "재전송"
                      : "인증번호 전송"}
                  </button>
                )}
            </div>
          </div>

          {isEditing &&
            isCodeSent && (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700">
                    인증번호 입력
                  </label>

                  <span className={`text-[11px] font-bold ${isPhoneVerified ? "text-emerald-600" : "text-red-500"}`}>
                    {isPhoneVerified ? "수정 가능시간" : "인증번호 유효시간"}{" "}
                    {formatTime(isPhoneVerified ? verifiedTimeLeft : timeLeft)}
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder={`인증번호 ${
                      AUTH_CONSTANTS
                        ?.SMS_CODE_LENGTH ||
                      6
                    }자리`}
                    value={authCode}
                    onChange={(e) =>
                      setAuthCode(
                        e.target.value
                      )
                    }
                    disabled={
                      isPhoneVerified ||
                      timeLeft === 0
                    }
                    maxLength={
                      AUTH_CONSTANTS
                        ?.SMS_CODE_LENGTH ||
                      6
                    }
                    className={`flex-1 px-3 py-2 text-xs border rounded transition-colors placeholder:text-gray-300 ${
                      isPhoneVerified
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={
                      onPhoneVerify
                    }
                    disabled={
                      isPhoneVerified ||
                      timeLeft === 0
                    }
                    className={`px-4 py-2 text-xs rounded font-medium whitespace-nowrap transition-colors ${
                      isPhoneVerified
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                    }`}
                  >
                    {isPhoneVerified
                      ? "인증완료"
                      : "인증하기"}
                  </button>
                </div>
              </div>
            )}

          <div className="mt-4 flex flex-col gap-3">
            {isEditing ? (
              <div className="flex justify-center gap-3">
                <ActionButton
                  label="취소"
                  variant="secondary"
                  type="button"
                  onClick={
                    handleCancelEdit
                  }
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
                  onClick={
                    handleStartEdit
                  }
                  className="w-full py-2.5 bg-amber-600 text-white rounded-md font-medium text-sm hover:bg-amber-700 transition-colors shadow-sm"
                >
                  회원 정보 수정
                </button>

                <button
                  type="button"
                  onClick={
                    onWithdrawal
                  }
                  className="w-full py-2.5 bg-red-600 text-white font-bold rounded-md text-sm hover:bg-red-700 active:bg-red-800 transition-colors shadow-sm"
                >
                  회원 탈퇴
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileFormStep;