import { useState } from "react";
import { AUTH_CONSTANTS } from "../../../constants/authConstants";

export const useMemberEdit = () => {
  // 1단계: 비밀번호 재확인 상태
  const [isVerified, setIsVerified] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);

  // 2단계: 조회/수정 모드 상태 (false: 조회, true: 수정)
  const [isEditing, setIsEditing] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);

  // 회원 정보 데이터 (이메일, 이름은 고정)
  const [formData, setFormData] = useState({
    email: "user@articket.com",
    password: "",
    nickname: "dwune",
    name: "한진형",
    phone: "010-6756-2684",
  });

  // SMS 전화번호 인증 상태
  const [authCode, setAuthCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 1단계 비밀번호 검증 제출
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!checkPassword.trim()) {
      alert("비밀번호를 입력해 주세요.");
      return;
    }
    // TODO: 백엔드 비밀번호 검증 API 연동
    setIsVerified(true);
  };

  // 폼 입력 변경
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 모드 시작
  const handleStartEdit = () => {
    setIsEditing(true);
    setIsPhoneVerified(false);
    setAuthCode("");
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsPhoneVerified(false);
    setAuthCode("");
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  // 🚀 SMS 인증번호 확인 (상수 AUTH_CONSTANTS 사용)
  const handlePhoneVerify = () => {
    if (!authCode.trim()) {
      alert(`인증번호 ${AUTH_CONSTANTS.SMS_CODE_LENGTH}자리를 입력해 주세요.`);
      return;
    }
    if (authCode.length === AUTH_CONSTANTS.SMS_CODE_LENGTH) {
      setIsPhoneVerified(true);
      alert("전화번호 인증이 완료되었습니다.");
    } else {
      alert(`인증번호 ${AUTH_CONSTANTS.SMS_CODE_LENGTH}자리를 정확히 입력해 주세요.`);
    }
  };

  // 최종 정보 수정 제출
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
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

  return {
    isVerified,
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
  };
};