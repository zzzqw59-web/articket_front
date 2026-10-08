import { useState, useEffect } from "react";
import { 
  getMyProfile, 
  checkMyPassword, 
  updateMyProfile, 
  requestWithdraw,
  cancelWithdraw, 
  getWithdrawStatus 
} from "../../../api/mypageApi";
import { AUTH_CONSTANTS } from "../../../constants/authConstants";
import { WITHDRAW_STATUS } from "../../../constants/config";

export const useMemberEdit = () => {
  // 1. 비밀번호 확인 모드 상태
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [verifyPurpose, setVerifyPurpose] = useState(null); // null | "EDIT" | "WITHDRAW"

  // 2. 정보 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);

  // 3. 회원 정보 Form State & 기존 전화번호 저장 State (전화번호 변경 감지용)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    name: "",
    phone: "",
    memberType: "",
    joinCreatedAt: "",
  });
  const [initialPhone, setInitialPhone] = useState(""); // 💡 ReferenceError 해결을 위한 state

  // 4. SMS 인증 상태
  const [authCode, setAuthCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 5. 회원 탈퇴 상태 정보 (WithdrawResponseDTO)
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
      
      // 💡 불러온 기존 전화번호 저장
      setInitialPhone(data.phone || "");

      // 탈퇴 상태 조회
      try {
        const withdrawData = await getWithdrawStatus();
        
        // 백엔드 응답의 withdrawStatus가 IN_PROGRESS일 때만 유지
        if (
          withdrawData &&
          (withdrawData.withdrawStatus === WITHDRAW_STATUS.IN_PROGRESS ||
           withdrawData.status === WITHDRAW_STATUS.IN_PROGRESS)
        ) {
          setWithdrawInfo(withdrawData);
        } else {
          setWithdrawInfo(null);
        }
      } catch (withdrawError) {
        console.warn("탈퇴 신청 이력이 없거나 조회 실패:", withdrawError);
        setWithdrawInfo(null); 
      }

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

  // 탈퇴 신청 취소(철회) 처리
  const handleCancelWithdrawal = async () => {
    if (!window.confirm("회원 탈퇴 신청을 취소하시겠습니까?\n취소 시 기존 계정을 정상적으로 이용하실 수 있습니다.")) {
      return;
    }

    try {
      await cancelWithdraw();
      alert("회원 탈퇴 신청이 정상적으로 취소되었습니다.");
      
      // 상태 즉시 리셋 후 서버 데이터 재조회
      setWithdrawInfo(null);
      await fetchMemberData();
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

  // 💡 SMS 인증 완료 콜백 (ProfileFormStep에서 성공 시 호출)
  // 알림창 중복 방지를 위해 alert 구문 제거 및 상태 업데이트만 진행
  const handlePhoneVerify = () => {
    setIsPhoneVerified(true);
  };

  // 프로필 정보 수정 저장 제출 핸들러
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // 최초 로드된 전화번호와 현재 폼에 입력된 전화번호 비교
    const isPhoneChanged = formData.phone !== initialPhone;

    // 전화번호를 실제 변경한 경우에만 SMS 인증 체크
    if (isPhoneChanged && !isPhoneVerified) {
      alert("전화번호 변경을 위해 SMS 인증을 완료해 주세요.");
      return;
    }

    // 백엔드 MemberUpdateRequestDTO 매핑 (nickname, password, phone)
    // 💡 phone은 백엔드 encryptPhone()을 위해 필수 전달
    const updateData = {
      nickname: formData.nickname,
      phone: formData.phone,
    };

    // 비밀번호를 입력한 경우에만 전달 (마스킹 문자열 제외)
    if (formData.password && formData.password !== "••••••••••••" && formData.password.trim() !== "") {
      updateData.password = formData.password;
    }

    try {
      await updateMyProfile(updateData);
      alert("회원 정보가 성공적으로 수정되었습니다.");

      setIsEditing(false);
      setIsPhoneVerified(false);
      setAuthCode("");
      await fetchMemberData(); // 최신 정보 재조회
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
      alert(error.response?.data?.message || "회원 정보 수정 중 오류가 발생했습니다.");
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
    withdrawInfo,
    handleCancelWithdrawal,
    handleFormChange,
    handleStartEdit,
    handleStartWithdrawal,
    handleCancelEdit,
    handlePhoneVerify,
    handleUpdateSubmit,
  };
};