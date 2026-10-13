import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { clearAuth, notifyMemberProfileUpdated } from "../../../api/authStorage";
import { normalizePhone, isValidPhone } from "../../auth/utils/authFormUtils";

export const useMemberEdit = () => {
  const navigate = useNavigate();

  // 1. 비밀번호 확인 모드 상태
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [verifyPurpose, setVerifyPurpose] = useState(null); // null | "EDIT" | "WITHDRAW"

  // 2. 정보 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);

  // 3. 회원 정보 Form State 및 저장된 원본
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    name: "",
    phone: "",
    memberType: "",
    joinCreatedAt: "",
  });
  const savedProfileRef = useRef(null);
  const currentPhoneRef = useRef("");

  // 4. SMS 인증 상태
  const [authCode, setAuthCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneVerifiedUntil, setPhoneVerifiedUntil] = useState(0);
  const verifiedPhoneRef = useRef("");

  // 5. 회원 탈퇴 상태 정보 (WithdrawResponseDTO)
  const [withdrawInfo, setWithdrawInfo] = useState(null);

  const resetPhoneVerification = () => {
    setIsPhoneVerified(false);
    setPhoneVerifiedUntil(0);
    setAuthCode("");
    verifiedPhoneRef.current = "";
  };

  // 초기 렌더링 시 회원 정보 & 탈퇴 상태 함께 불러오기
  const fetchMemberData = async () => {
    try {
      const data = await getMyProfile();
      const profile = {
        email: data.email || "",
        password: "",
        nickname: data.nickname || "",
        name: data.name || "",
        phone: normalizePhone(data.phone || ""),
        memberType: data.memberType || "",
        joinCreatedAt: data.joinCreatedAt || "",
      };

      savedProfileRef.current = profile;
      currentPhoneRef.current = profile.phone;
      setFormData(profile);

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

  // 인증 성공 이후 회원정보 수정 요청도 5분 이내에 완료해야 한다.
  useEffect(() => {
    if (!isPhoneVerified || !phoneVerifiedUntil) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (Date.now() >= phoneVerifiedUntil) {
        resetPhoneVerification();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPhoneVerified, phoneVerifiedUntil]);

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
          resetPhoneVerification();
          setCheckPassword("");
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

        await fetchMemberData();
        setIsVerifyingPassword(false);
        setCheckPassword("");
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
    const nextValue = name === "phone" ? normalizePhone(value) : value;

    if (name === "phone" && nextValue !== currentPhoneRef.current) {
      currentPhoneRef.current = nextValue;
      resetPhoneVerification();
    }

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsVerifyingPassword(false);
    setVerifyPurpose(null);
    resetPhoneVerification();
    setShowFormPassword(false);
    setCheckPassword("");

    if (savedProfileRef.current) {
      currentPhoneRef.current = savedProfileRef.current.phone;
      setFormData({ ...savedProfileRef.current });
    }
  };

  // SMS 인증은 화면에 작성된 전화번호와 인증 성공한 전화번호가 같을 때만 유지한다.
  const handlePhoneVerify = (verifiedPhone, requestStartedAt) => {
    const normalizedPhone = normalizePhone(verifiedPhone);

    if (normalizedPhone !== currentPhoneRef.current) {
      return;
    }

    verifiedPhoneRef.current = normalizedPhone;
    setIsPhoneVerified(true);
    setPhoneVerifiedUntil(
      requestStartedAt + AUTH_CONSTANTS.VERIFIED_VALID_SECONDS * 1000
    );
  };

  // 프로필 정보 수정 저장 제출 핸들러
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const phone = normalizePhone(formData.phone);
    if (!isValidPhone(phone)) {
      alert("올바른 휴대폰 번호를 입력해 주세요.");
      return;
    }

    // 전화번호 변경 여부에 상관없이 현재 입력된 번호의 SMS 인증이 필요하다.
    if (!isPhoneVerified || verifiedPhoneRef.current !== phone || Date.now() >= phoneVerifiedUntil) {
      resetPhoneVerification();
      alert(AUTH_CONSTANTS.MSG_NEED_PHONE_VERIFY);
      return;
    }

    // 백엔드 MemberUpdateRequestDTO 매핑 (nickname, password, phone)
    const updateData = {
      nickname: formData.nickname,
      phone,
    };

    const passwordChanged = Boolean(formData.password && formData.password.trim());
    if (passwordChanged) {
      updateData.password = formData.password;
    }

    try {
      await updateMyProfile(updateData);

      resetPhoneVerification();
      setIsEditing(false);
      setShowFormPassword(false);

      // 백엔드는 비밀번호 변경 시 DB의 Refresh Token을 삭제한다.
      if (passwordChanged) {
        clearAuth();
        alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
        navigate("/articket/login", { replace: true });
        return;
      }

      // DB의 최신 회원정보를 조회한 뒤 Header 닉네임도 갱신한다.
      savedProfileRef.current = { ...formData, password: "", phone };
      setFormData({ ...savedProfileRef.current });
      notifyMemberProfileUpdated();
      await fetchMemberData();
      alert(AUTH_CONSTANTS.MSG_UPDATE_SUCCESS);
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
    phoneVerifiedUntil,
    withdrawInfo,
    handleCancelWithdrawal,
    handleFormChange,
    handleStartEdit,
    handleStartWithdrawal,
    handleCancelEdit,
    resetPhoneVerification,
    handlePhoneVerify,
    handleUpdateSubmit,
  };
};
