import { useState, useEffect } from "react";
import { 
  getMyProfile, 
  checkMyPassword, 
  updateMyProfile, 
  requestWithdraw,
  cancelWithdraw,     // 💡 추가
  getWithdrawStatus   // 💡 추가
} from "../../../api/mypageApi";
import { AUTH_CONSTANTS } from "../../../constants/authConstants";

export const useMemberEdit = () => {
  // 1. 비밀번호 확인 모드 상태
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [verifyPurpose, setVerifyPurpose] = useState(null); // null | "EDIT" | "WITHDRAW"

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

  // 5. 💡 회원 탈퇴 상태 정보 (WithdrawResponseDTO: withdrawStatus, withdrawDue, withdrawRequestAt 등)
  const [withdrawInfo, setWithdrawInfo] = useState(null);

  // 초기 렌더링 시 회원 정보 & 탈퇴 상태 함께 불러오기
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

      // 💡 탈퇴 상태 조회 API 호출
      const withdrawData = await getWithdrawStatus();
      setWithdrawInfo(withdrawData);
    } catch (error) {
      console.error("회원 정보 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  // '회원 정보 수정' 버튼 클릭
  const handleStartEdit = () => {
    setCheckPassword("");
    setShowCheckPassword(false);
    setVerifyPurpose("EDIT");
    setIsVerifyingPassword(true);
  };

  // '회원 탈퇴' 버튼 클릭
  const handleStartWithdrawal = () => {
    setCheckPassword("");
    setShowCheckPassword(false);
    setVerifyPurpose("WITHDRAW");
    setIsVerifyingPassword(true);
  };

  // 비밀번호 입력 제출 핸들러
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!checkPassword.trim()) {
      alert(AUTH_CONSTANTS.MSG_ENTER_PASSWORD || "비밀번호를 입력해 주세요.");
      return;
    }

    if (verifyPurpose === "EDIT") {
      try {
        const matches = await checkMyPassword(checkPassword);
        if (matches) {
          setIsVerifyingPassword(false);
          setIsEditing(true);
          setIsPhoneVerified(false);
          setAuthCode("");
          setVerifyPurpose(null);
        } else {
          alert("비밀번호가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error("비밀번호 검증 오류:", error);
        alert("비밀번호 확인 중 오류가 발생했습니다.");
      }
    } else if (verifyPurpose === "WITHDRAW") {
      const isConfirmed = window.confirm(
        "정말로 회원 탈퇴를 신청하시겠습니까?\n신청 후 30일간의 유예기간이 부여되며, 유예기간 내에 철회할 수 있습니다."
      );
      if (!isConfirmed) return;

      try {
        const result = await requestWithdraw(checkPassword);
        alert(result?.message || "회원 탈퇴 신청이 완료되었습니다.");
        
        // 데이터 최신화 (또는 로그아웃)
        fetchMemberData();
        setIsVerifyingPassword(false);
        setVerifyPurpose(null);
      } catch (error) {
        console.error("회원 탈퇴 신청 실패:", error);
        const errorMessage = error.response?.data?.message || "회원 탈퇴 신청 중 오류가 발생했습니다.";
        alert(errorMessage);
      }
    }
  };

  // 💡 6. 탈퇴 신청 취소(철회) 처리
  const handleCancelWithdrawal = async () => {
    if (!window.confirm("회원 탈퇴 신청을 취소하시겠습니까?\n취소 시 기존 계정을 정상적으로 이용하실 수 있습니다.")) {
      return;
    }

    try {
      await cancelWithdraw();
      alert("회원 탈퇴 신청이 정상적으로 취소되었습니다.");
      fetchMemberData(); // 회원 정보 및 탈퇴 상태 재조회
    } catch (error) {
      console.error("탈퇴 취소 실패:", error);
      const errorMessage = error.response?.data?.message || "탈퇴 취소 처리 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsVerifyingPassword(false);
    setVerifyPurpose(null);
    setIsPhoneVerified(false);
    setAuthCode("");
    setFormData((prev) => ({ ...prev, password: "" }));
  };

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
    withdrawInfo, // 💡 전달
    handleCancelWithdrawal, // 💡 전달
    handleFormChange,
    handleStartEdit,
    handleStartWithdrawal,
    handleCancelEdit,
    handlePhoneVerify,
    handleUpdateSubmit,
  };
};