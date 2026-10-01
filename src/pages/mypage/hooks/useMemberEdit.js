import { useState } from "react";
import { AUTH_CONSTANTS } from "../../../constants/authConstants";

export const useMemberEdit = () => {
  // 1. 비밀번호 확인 화면 모드 플래그
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);

  // 2. 수정 모드 상태 (false: 조회 전용, true: 수정 가능)
  const [isEditing, setIsEditing] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);

  // 회원 정보 데이터
  const [formData, setFormData] = useState({
    email: "user@articket.com",
    password: "",
    nickname: "dwune",
    name: "한진형",
    phone: "010-6756-2684",
    createdAt: "2026년 9월 17일",
  });

  // SMS 전화번호 인증 상태
  const [authCode, setAuthCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // '회원 정보 수정' 버튼 클릭 시 비밀번호 검증 화면으로 전환
  const handleStartEdit = () => {
    setCheckPassword("");
    setShowCheckPassword(false);
    setIsVerifyingPassword(true);
  };

  // 비밀번호 입력 확인 제출
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!checkPassword.trim()) {
      alert(AUTH_CONSTANTS.MSG_ENTER_PASSWORD);
      return;
    }
    // TODO: 백엔드 비밀번호 검증 API 연동
    setIsVerifyingPassword(false);
    setIsEditing(true);
    setIsPhoneVerified(false);
    setAuthCode("");
  };

  // 폼 입력 변경
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsVerifyingPassword(false);
    setIsPhoneVerified(false);
    setAuthCode("");
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  // SMS 인증번호 확인
  const handlePhoneVerify = () => {
    const codeLength = AUTH_CONSTANTS?.SMS_CODE_LENGTH || 6;
    if (!authCode.trim()) {
      alert(AUTH_CONSTANTS.MSG_ENTER_AUTH_CODE.replace("{length}", codeLength));
      return;
    }
    if (authCode.length === codeLength) {
      setIsPhoneVerified(true);
      alert(AUTH_CONSTANTS.MSG_PHONE_VERIFIED_SUCCESS);
    } else {
      alert(AUTH_CONSTANTS.MSG_EXACT_AUTH_CODE.replace("{length}", codeLength));
    }
  };

  // 최종 정보 수정 제출
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!isPhoneVerified) {
      alert(AUTH_CONSTANTS.MSG_NEED_PHONE_VERIFY);
      return;
    }
    // TODO: 백엔드 회원정보 수정 API 연동
    alert(AUTH_CONSTANTS.MSG_UPDATE_SUCCESS);
    setIsEditing(false);
    setIsPhoneVerified(false);
    setAuthCode("");
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  // 회원 탈퇴 처리
  const handleWithdrawal = () => {
    // TODO: 백엔드 회원 탈퇴 API 연동 및 localStorage 토큰 삭제/로그아웃 처리
    alert(AUTH_CONSTANTS.MSG_WITHDRAWAL_SUCCESS);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/articket";
  };

  return {
    isVerifyingPassword,
    checkPassword,
    setCheckPassword,
    showCheckPassword,
    setShowCheckPassword,
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
    handleCancelEdit,
    handlePhoneVerify,
    handleUpdateSubmit,
    handleWithdrawal,
  };
};