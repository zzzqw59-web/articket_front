import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import ActionButton from "../../components/common/ActionButton";
import Badge from "../../components/common/Badge";

const MemberEditPage = () => {
  // 1단계: 비밀번호 재확인 완료 여부
  const [isVerified, setIsVerified] = useState(false);

  // 1단계 비밀번호 입력 & 토글 상태
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);

  // 2단계 회원 정보 폼 데이터
  const [formData, setFormData] = useState({
    email: "user@articket.com",
    password: "••••••••••••",
    nickname: "dwune",
    name: "한진형",
    phone: "010-6756-2684",
  });

  // 2단계 비밀번호 표시 토글
  const [showFormPassword, setShowFormPassword] = useState(false);

  // 검증 및 인증 관련 상태 메시지
  const [emailStatus, setEmailStatus] = useState(""); // 인증 성공/실패 텍스트
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 유효성 에러
  const [phoneStatus, setPhoneStatus] = useState(""); // 전화번호 인증 텍스트

  // 1단계: 비밀번호 확인 제출
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!checkPassword) {
      alert("비밀번호를 입력해 주세요.");
      return;
    }
    // API 통신 검증 로직 연결 위치
    setIsVerified(true);
  };

  // 2단계: 폼 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 비밀번호 입력 시 유효성 검사 예시
    if (name === "password") {
      if (value.length > 0 && value.length < 8) {
        setPasswordError("비밀번호 형식이 올바르지 않습니다.");
      } else {
        setPasswordError("");
      }
    }
  };

  // 이메일 인증 버튼
  const handleEmailVerify = () => {
    setEmailStatus("인증번호가 전송되었습니다.");
  };

  // 닉네임 중복검사 버튼
  const handleNicknameCheck = () => {
    alert("사용 가능한 닉네임입니다.");
  };

  // 전화번호 인증 버튼
  const handlePhoneVerify = () => {
    setPhoneStatus("인증이 완료되었습니다.");
  };

  // 최종 수정 버튼
  const handleUpdate = (e) => {
    e.preventDefault();
    alert("회원 정보가 성공적으로 수정되었습니다.");
  };

  // 비밀번호 보이기 / 가리기 아이콘 (완전한 눈 윤곽 + 슬래시 빗금)
  const renderEyeIcon = (isVisible, toggleFunc) => (
    <button
      type="button"
      onClick={toggleFunc}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
      title={isVisible ? "비밀번호 가리기" : "비밀번호 표시"}
    >
      {isVisible ? (
        /* 1. 비밀번호 표시 (Eye) */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) : (
        /* 2. 비밀번호 가려짐 (온전한 눈 형태 + 대각선 빗금) */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          {/* 전체 눈 외곽 라인 (잘림 없음) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          {/* 중앙 눈동자 */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          {/* 대각선 빗금 */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
      {/* ========================================================= */}
      {/* Step 1: 비밀번호 재확인 화면                                 */}
      {/* ========================================================= */}
      {!isVerified ? (
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-sm p-8 mt-10 flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">비밀번호 입력</h2>
          <p className="text-xs text-gray-500 mb-6">
            회원정보 확인을 위해 비밀번호를 재확인 합니다.
          </p>

          <form onSubmit={handleVerifySubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <div className="relative w-full">
                <input
                  type={showCheckPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  value={checkPassword}
                  onChange={(e) => setCheckPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-600"
                />
                {renderEyeIcon(showCheckPassword, () =>
                  setShowCheckPassword(!showCheckPassword)
                )}
              </div>
            </div>

            <ActionButton
              label="입력 확인"
              variant="primary"
              type="submit"
              className="w-full mt-2"
            />
          </form>
        </div>
      ) : (
        /* ========================================================= */
        /* Step 2: 회원 정보 수정 화면                                  */
        /* ========================================================= */
        <div className="w-full flex flex-col items-center gap-6">
          <PageHeader
            title="회원 정보 관리"
            description="회원님의 개인정보를 조회하고 수정할 수 있습니다."
          />

          <div className="w-full max-w-lg bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-6">
            {/* 1. 프로필 요약 카드 */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              {/* 원형 회원 권한 아이콘 */}
              <div className="w-16 h-16 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                회원
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-gray-900">
                    {formData.nickname} 님
                  </span>
                  {/* 계정 상태 뱃지 */}
                  <Badge label="활동중" variant="ongoing" />
                </div>
                <div className="text-xs text-gray-400 flex flex-col gap-0.5">
                  <span>가입일 : 2026년 9월 17일</span>
                  <span>최근 수정일 : 2026년 9월 17일</span>
                </div>
              </div>
            </div>

            {/* 2. 회원 정보 수정 폼 */}
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              {/* 이메일 */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">이메일</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleEmailVerify}
                    className="px-3 py-2 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 whitespace-nowrap"
                  >
                    인증하기
                  </button>
                </div>
                {emailStatus && (
                  <span className="text-[11px] text-emerald-600 text-right mt-0.5">
                    {emailStatus}
                  </span>
                )}
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">비밀번호</label>
                <div className="relative w-full">
                  <input
                    type={showFormPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-600 bg-white"
                  />
                  {renderEyeIcon(showFormPassword, () =>
                    setShowFormPassword(!showFormPassword)
                  )}
                </div>
                {/* 우측 하단 유효성 에러 문구 (스토리보드 빨간색 문구 대응) */}
                <span className="text-[11px] text-red-500 text-right mt-0.5 min-h-[16px]">
                  {passwordError || "비밀번호 형식이 올바르지 않습니다."}
                </span>
              </div>

              {/* 닉네임 */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">닉네임</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleNicknameCheck}
                    className="px-3 py-2 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 whitespace-nowrap"
                  >
                    중복검사
                  </button>
                </div>
              </div>

              {/* 이름 */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">이름</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-600 bg-white"
                />
              </div>

              {/* 전화번호 */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">전화번호</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handlePhoneVerify}
                    className="px-3 py-2 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 whitespace-nowrap"
                  >
                    인증하기
                  </button>
                </div>
                {phoneStatus && (
                  <span className="text-[11px] text-emerald-600 text-right mt-0.5">
                    {phoneStatus}
                  </span>
                )}
              </div>

              {/* 하단 취소 / 수정 버튼 */}
              <div className="flex justify-center gap-3 mt-4">
                <ActionButton
                  label="취소"
                  variant="secondary"
                  type="button"
                  onClick={() => setIsVerified(false)}
                />
                <ActionButton
                  label="수정"
                  variant="primary"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberEditPage;