import { useState, useEffect } from "react";
import { getMyProfile, checkMyPassword, updateMyProfile } from "../../../api/mypageApi";
import { AUTH_CONSTANTS } from "../../../constants/authConstants";

export const useMemberEdit = () => {
  // 1. 비밀번호 확인 모드 상태
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  
  // 검증 목적 상태: null | "EDIT" (정보 수정) | "WITHDRAW" (회원 탈퇴)
  const [verifyPurpose, setVerifyPurpose] = useState(null);

  // 2. 정보 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);

  // 3. 회원 정보 Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    name: "",
    phone: "",
    memberType: "",
    joinCreatedAt: "",
  });

  // 4. SMS 인증 상태
  const [authCode, setAuthCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 초기 렌더링 시 회원 정보 불러오기
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const data = await getMyProfile();
        setFormData((prev) => ({
          ...prev,
          email: data.email || "",
          nickname: data.nickname || "",
          name: data.name || "",
          phone: data.phone || "",
          memberType: data.memberType || "",
          joinCreatedAt: data.joinCreatedAt || "",
        }));
      } catch (error) {
        console.error("회원 정보 조회 실패:", error);
        alert("회원 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchMemberData();
  }, []);

  // '회원 정보 수정' 버튼 클릭 시 
  const handleStartEdit = () => {
    setCheckPassword("");
    setShowCheckPassword(false);
    setVerifyPurpose("EDIT");
    setIsVerifyingPassword(true);
  };

  // 💡 1단계: '회원 탈퇴' 버튼 클릭 시 바로 비밀번호 검증 창으로 진입
  const handleStartWithdrawal = () => {
    setCheckPassword("");
    setShowCheckPassword(false);
    setVerifyPurpose("WITHDRAW");
    setIsVerifyingPassword(true);
  };

  // 비밀번호 입력 검증 제출
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!checkPassword.trim()) {
      alert(AUTH_CONSTANTS.MSG_ENTER_PASSWORD);
      return;
    }

    try {
      const matches = await checkMyPassword(checkPassword);
      if (matches) {
        setIsVerifyingPassword(false);

        // 💡 2단계 & 3단계: 비밀번호 검증 성공 후 목적별 분기
        if (verifyPurpose === "EDIT") {
          setIsEditing(true);
          setIsPhoneVerified(false);
          setAuthCode("");
        } else if (verifyPurpose === "WITHDRAW") {
          // 비밀번호 확인 통과 후 최종 탈퇴 확인 창 띄우기
          const isConfirmed = window.confirm("비밀번호가 확인되었습니다.\n정말로 탈퇴하시겠습니까? 탈퇴 시 복구할 수 없습니다.");
          if (isConfirmed) {
            executeWithdrawal();
          }
        }
        
        setVerifyPurpose(null); // 목적 초기화
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 검증 오류:", error);
      alert("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  // 폼 입력 변경
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 및 검증 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsVerifyingPassword(false);
    setVerifyPurpose(null);
    setIsPhoneVerified(false);
    setAuthCode("");
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  // 전화번호 인증번호 확인
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
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!isPhoneVerified) {
      alert(AUTH_CONSTANTS.MSG_NEED_PHONE_VERIFY);
      return;
    }

    try {
      const updateData = {
        nickname: formData.nickname,
        phone: formData.phone,
      };

      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }

      await updateMyProfile(updateData);

      alert(AUTH_CONSTANTS.MSG_UPDATE_SUCCESS);
      setIsEditing(false);
      setIsPhoneVerified(false);
      setAuthCode("");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
      alert("회원 정보 수정 중 오류가 발생했습니다.");
    }
  };

  // 💡 3단계: 최종 탈퇴 실행 함수
  const executeWithdrawal = async () => {
    try {
      // TODO: 백엔드 DELETE /api/members/me 연동 예정
      alert(AUTH_CONSTANTS.MSG_WITHDRAWAL_SUCCESS);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/articket";
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  return {
    isVerifyingPassword,
    checkPassword,
    setCheckPassword,
    showCheckPassword,
    setShowCheckPassword,
    verifyPurpose,
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
    handleStartWithdrawal,
    handleCancelEdit,
    handlePhoneVerify,
    handleUpdateSubmit,
  };
};