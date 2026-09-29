import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import ActionButton from "../../components/common/ActionButton";
import Badge from "../../components/common/Badge";

const MemberEditPage = () => {
  // 1단계: 비밀번호 재확인 완료 여부
  const [isVerified, setIsVerified] = useState(false);

  // 1단계: 비밀번호 입력 & 토글 상태
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);

  // 2단계: 회원 정보 조회/수정 모드 전환 상태 (false: 조회 모드, true: 수정/인증 모드)
  const [isEditing, setIsEditing] = useState(false);

  // 2단계: 회원 정보 폼 데이터 (이메일, 이름은 고정값)
  const [formData, setFormData] = useState({
    email: "user@articket.com",
    password: "",
    nickname: "dwune",
    name: "한진형",
    phone: "010-6756-2684",
  });

  // 수정 모드에서의 비밀번호 보이기/가리기 토글
  const [showFormPassword, setShowFormPassword] = useState(false);

  // 전화번호 문자 인증 관련 상태
  const [authCode, setAuthCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 1단계: 비밀번호 확인 제출
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!checkPassword) {
      alert("비밀번호를 입력해 주세요.");
      return;
    }
    // TODO: 백엔드 비밀번호 검증 API 연결
    setIsVerified(true);
  };

  // 2단계: 폼 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // [수정] 버튼 클릭 시 수정/인증 모드 진입
  const handleStartEdit = () => {
    setIsEditing(true);
    setIsPhoneVerified(false);
    setAuthCode("");
  };

  // 수정 취소 버튼 클릭 시 조회 모드로 복귀
  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsPhoneVerified(false);
    setAuthCode("");
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  // 문자 인증번호 확인 버튼
  const handlePhoneVerify = () => {
    if (!authCode.trim()) {
      alert("인증번호 6자리를 입력해 주세요.");
      return;
    }

    // TODO: 백엔드 SMS 인증번호 검증 API 연동
    if (authCode.length === 6) {
      setIsPhoneVerified(true);
      alert("전화번호 인증이 완료되었습니다.");
    } else {
      alert("인증번호 6자리를 정확히 입력해 주세요.");
    }
  };

  // 최종 회원 정보 수정 제출
  const handleUpdate = (e) => {
    e.preventDefault();

    // ⚠️ 전화번호 문자 인증 필수 제어
    if (!isPhoneVerified) {
      alert("전화번호 인증을 완료해야만 회원 정보를 수정할 수 있습니다.");
      return;
    }

    // TODO: 백엔드 회원정보 수정 API 연동
    alert("회원 정보가 성공적으로 수정되었습니다.");
    setIsEditing(false);
    setIsPhoneVerified(false);
    setAuthCode("");
  };

  // 비밀번호 보이기 / 가리기 아이콘
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
      {/* ========================================================= */}
      {/* Step 1: 비밀번호 재확인 화면                              */}
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
        /* Step 2: 회원 정보 조회 / 수정 화면                       */
        /* ========================================================= */
        <div className="w-full flex flex-col items-center gap-6">
          <PageHeader
            title="회원 정보 관리"
            description="회원님의 개인정보를 조회하고 수정할 수 있습니다."
          />

          <div className="w-full max-w-lg bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-6">
            {/* 1. 프로필 요약 카드 */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                회원
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-gray-900">
                    {formData.nickname} 님
                  </span>
                  <Badge label="활동중" variant="ongoing" />
                </div>
                <div className="text-xs text-gray-400 flex flex-col gap-0.5">
                  <span>가입일 : 2026년 9월 17일</span>
                  <span>최근 수정일 : 2026년 9월 17일</span>
                </div>
              </div>
            </div>

            {/* 2. 회원 정보 폼 */}
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              {/* 이메일 (항상 읽기 전용) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">이메일</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded cursor-default"
                />
              </div>

              {/* 비밀번호 (수정 모드일 때만 입력 가능) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">비밀번호</label>
                <div className="relative w-full">
                  <input
                    type={isEditing ? (showFormPassword ? "text" : "password") : "password"}
                    name="password"
                    placeholder={isEditing ? "변경할 비밀번호를 입력해 주세요" : "••••••••••••"}
                    value={isEditing ? formData.password : "••••••••••••"}
                    onChange={handleChange}
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

              {/* 닉네임 (수정 가능) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">닉네임</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 text-sm border rounded transition-colors ${
                    isEditing
                      ? "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                      : "border-gray-200 bg-gray-50 text-gray-500 cursor-default"
                  }`}
                />
              </div>

              {/* 이름 (항상 읽기 전용) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">이름</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded cursor-default"
                />
              </div>

              {/* 전화번호 (수정 가능) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">전화번호</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 text-sm border rounded transition-colors ${
                    isEditing
                      ? "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                      : "border-gray-200 bg-gray-50 text-gray-500 cursor-default"
                  }`}
                />
              </div>

              {/* 문자 인증번호 입력 영역 (수정 버튼 클릭 시 노출) */}
              {isEditing && (
                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-xs font-semibold text-gray-700">인증번호</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="문자 메세지로 전송된 인증번호 6자리를 입력해주세요"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      disabled={isPhoneVerified}
                      maxLength={6}
                      className={`flex-1 px-3 py-2 text-xs border rounded transition-colors placeholder:text-gray-300 ${
                        isPhoneVerified
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-gray-300 bg-white focus:outline-none focus:border-amber-600"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handlePhoneVerify}
                      disabled={isPhoneVerified}
                      className={`px-4 py-2 text-xs rounded font-medium whitespace-nowrap transition-colors ${
                        isPhoneVerified
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-amber-600 text-white hover:bg-amber-700"
                      }`}
                    >
                      {isPhoneVerified ? "인증완료" : "인증하기"}
                    </button>
                  </div>
                  {isPhoneVerified && (
                    <span className="text-[11px] text-emerald-600 mt-0.5">
                      ✓ 전화번호 인증이 완료되었습니다.
                    </span>
                  )}
                </div>
              )}

              {/* 하단 버튼 영역 */}
              <div className="mt-4">
                {isEditing ? (
                  /* 수정 모드: [취소] / [수정] 버튼 */
                  <div className="flex justify-center gap-3">
                    <ActionButton
                      label="취소"
                      variant="secondary"
                      type="button"
                      onClick={handleCancelEdit}
                    />
                    <ActionButton
                      label="수정"
                      variant="primary"
                      type="submit"
                    />
                  </div>
                ) : (
                  /* 조회 모드: 단일 [수정] 주황색 버튼 */
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="w-full py-2.5 bg-amber-600 text-white rounded-md font-medium text-sm hover:bg-amber-700 transition-colors"
                  >
                    수정
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberEditPage;