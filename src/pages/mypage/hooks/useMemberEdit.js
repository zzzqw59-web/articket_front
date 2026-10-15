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
import { useModal } from "../../../hooks/useModal"; // 경로 확인 필요

export const useMemberEdit = () => {
  const navigate = useNavigate();

  // 커스텀 모달 훅 선언
  const { modalState, showAlert, showConfirm, closeModal, handleConfirm, handleCancel } = useModal();

  // 1. 비밀번호 확인 모드 상태
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const verifiedPasswordRef = useRef("");
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
    verifiedPasswordRef.current = "";
    setCheckPassword("");
    setShowCheckPassword(false);
    setVerifyPurpose("EDIT");
    setIsVerifyingPassword(true);
  };

  // '회원 탈퇴' 버튼 클릭
  const handleStartWithdrawal = () => {
    verifiedPasswordRef.current = "";
    setCheckPassword("");
    setShowCheckPassword(false);
    setVerifyPurpose("WITHDRAW");
    setIsVerifyingPassword(true);
  };

  // 탈퇴 신청 성공 후 후속 처리 함수 (가독성 향상)
  const handleWithdrawSuccess = async () => {
    await fetchMemberData();
    setIsVerifyingPassword(false);
    setCheckPassword("");
    setVerifyPurpose(null);
  };

  // 비밀번호 입력 제출 핸들러
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!checkPassword.trim()) {
      showAlert({ message: AUTH_CONSTANTS.MSG_ENTER_PASSWORD || "비밀번호를 입력해 주세요." });
      return;
    }

    if (verifyPurpose === "EDIT") {
      try {
        const matches = await checkMyPassword(checkPassword);
        if (matches) {
          verifiedPasswordRef.current = checkPassword;
          setIsVerifyingPassword(false);
          setIsEditing(true);
          resetPhoneVerification();
          setCheckPassword("");
          setVerifyPurpose(null);
        } else {
          showAlert({ message: "비밀번호가 일치하지 않습니다." });
        }
      } catch (error) {
        console.error("비밀번호 검증 오류:", error.response?.status || error.message);
        const errorMessage = error.response?.data?.message || "";
        if (
          error.response?.status === 403 &&
          (errorMessage.includes("비활성화된 회원") ||
           errorMessage.includes("탈퇴 진행 중") ||
           errorMessage.includes("탈퇴 완료된 회원"))
        ) {
          showAlert({ message: "제재/탈퇴 상태에서는 회원정보 변경이 불가능합니다." });
        } else {
          showAlert({ message: "비밀번호 확인 중 오류가 발생했습니다." });
        }
      }
    } else if (verifyPurpose === "WITHDRAW") {
      showConfirm({
        title: "회원 탈퇴 신청",
        message: "정말로 회원 탈퇴를 신청하시겠습니까?\n신청 후 30일간의 유예기간이 부여되며, 유예기간 내에 철회할 수 있습니다.",
        confirmLabel: "신청하기",
        onConfirm: async () => {
          try {
            const result = await requestWithdraw(checkPassword);
            showAlert({
              message: result?.message || "회원 탈퇴 신청이 완료되었습니다.",
              onConfirm: handleWithdrawSuccess // 분리한 핸들러 연결
            });
          } catch (error) {
            console.error("회원 탈퇴 신청 실패:", error);
            const errorMessage = error.response?.data?.message || "회원 탈퇴 신청 중 오류가 발생했습니다.";
            showAlert({ message: errorMessage });
          }
        }
      });
    }
  };

  // 탈퇴 신청 취소(철회) 처리
  const handleCancelWithdrawal = () => {
    showConfirm({
      title: "탈퇴 신청 취소",
      message: "회원 탈퇴 신청을 취소하시겠습니까?\n취소 시 기존 계정을 정상적으로 이용하실 수 있습니다.",
      confirmLabel: "확인",
      onConfirm: async () => {
        try {
          await cancelWithdraw();
          showAlert({
            message: "회원 탈퇴 신청이 정상적으로 취소되었습니다.",
            onConfirm: async () => {
              setWithdrawInfo(null);
              await fetchMemberData();
            }
          });
        } catch (error) {
          console.error("탈퇴 취소 실패:", error);
          const errorMessage = error.response?.data?.message || "탈퇴 취소 처리 중 오류가 발생했습니다.";
          showAlert({ message: errorMessage });
        }
      }
    });
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
    verifiedPasswordRef.current = "";
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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const phone = normalizePhone(formData.phone);
    if (!isValidPhone(phone)) {
      showAlert({ message: "올바른 휴대폰 번호를 입력해 주세요." });
      return;
    }

    if (!isPhoneVerified || verifiedPhoneRef.current !== phone || Date.now() >= phoneVerifiedUntil) {
      resetPhoneVerification();
      showAlert({ message: AUTH_CONSTANTS.MSG_NEED_PHONE_VERIFY });
      return;
    }

    const updateData = {
      nickname: formData.nickname,
      currentPassword: verifiedPasswordRef.current,
      phone,
    };

    const passwordChanged = Boolean(formData.password && formData.password.trim());
    if (passwordChanged) {
      updateData.password = formData.password;
    }

    try {
      await updateMyProfile(updateData);

      verifiedPasswordRef.current = "";
      resetPhoneVerification();
      setIsEditing(false);
      setShowFormPassword(false);

      if (passwordChanged) {
        clearAuth();
        showAlert({
          message: "회원 정보가 변경되었습니다. 다시 로그인해 주세요.",
          onConfirm: () => navigate("/articket/login", { replace: true })
        });
        return;
      }

      savedProfileRef.current = { ...formData, password: "", phone };
      setFormData({ ...savedProfileRef.current });
      notifyMemberProfileUpdated();
      await fetchMemberData();
      showAlert({ message: AUTH_CONSTANTS.MSG_UPDATE_SUCCESS });
    } catch (error) {
      console.error("회원정보 수정 실패:", error.response?.status || error.message);
      showAlert({ message: error.response?.data?.message || error.response?.data?.detail || "회원 정보 수정 중 오류가 발생했습니다." });
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
    // 모달 관련 상태 및 핸들러 반환
    modalState,
    showAlert,
    handleConfirm,
    handleCancel,
  };
};