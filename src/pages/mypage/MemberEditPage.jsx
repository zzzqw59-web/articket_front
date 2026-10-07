import { useMemberEdit } from "./hooks/useMemberEdit";
import PasswordVerifyStep from "./components/PasswordVerifyStep";
import ProfileFormStep from "./components/ProfileFormStep";

const MemberEditPage = () => {
  const {
    isVerifyingPassword,
    checkPassword,
    setCheckPassword,
    showCheckPassword,
    setShowCheckPassword,
    verifyPurpose, // 💡 필요시 UI에 목적별 안내 문구 표시에 사용 가능
    handleVerifySubmit,
    isEditing,
    formData,
    showFormPassword,
    setShowFormPassword,
    authCode,
    setAuthCode,
    isPhoneVerified,
    handleFormChange,
    handleStartEdit,
    handleStartWithdrawal, // 💡 handleWithdrawal -> handleStartWithdrawal 로 변경
    handleCancelEdit,
    handlePhoneVerify,
    handleUpdateSubmit,
  } = useMemberEdit();

  // 비밀번호 보이기 / 가리기 아이콘 공통 렌더러
  const renderEyeIcon = (isVisible, toggleFunc) => (
    <button
      type="button"
      onClick={toggleFunc}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
      title={isVisible ? "비밀번호 가리기" : "비밀번호 표시"}
    >
      {isVisible ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
      {/* 💡 정보 수정 또는 회원 탈퇴 진행 시 비밀번호 검증 화면 분기 */}
      {isVerifyingPassword ? (
        <PasswordVerifyStep
          checkPassword={checkPassword}
          setCheckPassword={setCheckPassword}
          showCheckPassword={showCheckPassword}
          setShowCheckPassword={setShowCheckPassword}
          onVerifySubmit={handleVerifySubmit}
          renderEyeIcon={renderEyeIcon}
          verifyPurpose={verifyPurpose} // (선택) PasswordVerifyStep 내부에서 "탈퇴를 위한 비밀번호 확인" 문구 표시용
        />
      ) : (
        <ProfileFormStep
          formData={formData}
          isEditing={isEditing}
          showFormPassword={showFormPassword}
          setShowFormPassword={setShowFormPassword}
          authCode={authCode}
          setAuthCode={setAuthCode}
          isPhoneVerified={isPhoneVerified}
          onFormChange={handleFormChange}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onPhoneVerify={handlePhoneVerify}
          onUpdateSubmit={handleUpdateSubmit}
          onWithdrawal={handleStartWithdrawal} // 💡 수정: 바로 탈퇴되지 않고 비밀번호 검증 모드로 전환
          renderEyeIcon={renderEyeIcon}
        />
      )}
    </div>
  );
};

export default MemberEditPage;