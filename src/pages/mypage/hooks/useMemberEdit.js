
import { useState, useEffect, useRef } from "react";

import {
  getMyProfile,
  checkMyPassword,
  updateMyProfile,
  requestWithdraw,
  cancelWithdraw,
  getWithdrawStatus,
} from "../../../api/mypageApi";

import {
  AUTH_CONSTANTS,
  VERIFICATION_TYPE,
} from "../../../constants/authConstants";

import {
  sendPhoneVerification,
  verifyPhoneVerification,
} from "../../../api/authApi";

import {
  getApiErrorMessage,
  isValidPhone,
  normalizePhone,
} from "../../auth/utils/authFormUtils";

import { WITHDRAW_STATUS } from "../../../constants/config";

export const useMemberEdit = () => {
  // 1. 비밀번호 확인 모드 상태
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [verifyPurpose, setVerifyPurpose] = useState(null);

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

  // 4. SMS 인증 상태
  const [authCode, setAuthCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneVerifiedUntil, setPhoneVerifiedUntil] = useState(0);
  const savedProfileRef = useRef(null);

  // 5. 회원 탈퇴 상태 정보 (WithdrawResponseDTO)
  const [withdrawInfo, setWithdrawInfo] = useState(null);

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
        console.warn(
          "탈퇴 신청 이력이 없거나 조회 실패:",
          withdrawError
        );

        setWithdrawInfo(null);
      }
    } catch (error) {
      console.error("회원 정보 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  // 인증 성공 시각부터 5분이 지나면 프론트의 인증 상태도 만료한다.
  useEffect(() => {
    if (!isPhoneVerified || !phoneVerifiedUntil) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (Date.now() >= phoneVerifiedUntil) {
        setIsPhoneVerified(false);
        setPhoneVerifiedUntil(0);
        setAuthCode("");
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPhoneVerified, phoneVerifiedUntil]);

  const handleStartEdit = () => {
    setCheckPassword("");
    setShowCheckPassword(false);
    setVerifyPurpose("EDIT");
    setIsVerifyingPassword(true);
  };

  const handleStartWithdrawal = () => {
    setCheckPassword("");
    setShowCheckPassword(false);
    setVerifyPurpose("WITHDRAW");
    setIsVerifyingPassword(true);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    if (!checkPassword.trim()) {
      alert(
        AUTH_CONSTANTS.MSG_ENTER_PASSWORD ||
          "비밀번호를 입력해 주세요."
      );

      return;
    }

    if (verifyPurpose === "EDIT") {
      try {
        const matches = await checkMyPassword(checkPassword);

        if (matches) {
          setIsVerifyingPassword(false);
          setIsEditing(true);
          setIsPhoneVerified(false);
          setPhoneVerifiedUntil(0);
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

      if (!isConfirmed) {
        return;
      }

      try {
        const result = await requestWithdraw(checkPassword);

        alert(
          result?.message ||
            "회원 탈퇴 신청이 완료되었습니다."
        );

        await fetchMemberData();

        setIsVerifyingPassword(false);
        setVerifyPurpose(null);
        setCheckPassword("");
      } catch (error) {
        console.error("회원 탈퇴 신청 실패:", error);

        alert(
          getApiErrorMessage(
            error,
            "회원 탈퇴 신청 중 오류가 발생했습니다."
          )
        );
      }
    }
  };

  // 탈퇴 신청 취소(철회) 처리
  const handleCancelWithdrawal = async () => {
    if (
      !window.confirm(
        "회원 탈퇴 신청을 취소하시겠습니까?\n취소 시 기존 계정을 정상적으로 이용하실 수 있습니다."
      )
    ) {
      return;
    }

    try {
      await cancelWithdraw();

      // 상태 즉시 리셋 후 서버 데이터 재조회
      setWithdrawInfo(null);
      await fetchMemberData();

      alert(
        "회원 탈퇴 신청이 정상적으로 취소되었습니다."
      );
    } catch (error) {
      console.error("탈퇴 취소 실패:", error);

      alert(
        getApiErrorMessage(
          error,
          "탈퇴 취소 처리 중 오류가 발생했습니다."
        )
      );
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? normalizePhone(value) : value,
    }));

    if (name === "phone") {
      setIsPhoneVerified(false);
      setPhoneVerifiedUntil(0);
      setAuthCode("");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsVerifyingPassword(false);
    setVerifyPurpose(null);
    setIsPhoneVerified(false);
    setPhoneVerifiedUntil(0);
    setAuthCode("");
    setShowFormPassword(false);

    if (savedProfileRef.current) {
      setFormData({ ...savedProfileRef.current });
    }
  };

  const handleSendPhoneCode = async () => {
    if (!isValidPhone(formData.phone)) {
      alert("올바른 휴대폰 번호를 입력해 주세요.");

      return false;
    }

    try {
      await sendPhoneVerification({
        phone: normalizePhone(formData.phone),
        type: VERIFICATION_TYPE.MEMBER_UPDATE,
      });

      setIsPhoneVerified(false);
      setPhoneVerifiedUntil(0);
      setAuthCode("");

      alert("인증번호가 발송되었습니다.");

      return true;
    } catch (error) {
      console.error("인증번호 전송 실패:", error);

      alert(
        getApiErrorMessage(
          error,
          "인증번호 전송 중 오류가 발생했습니다."
        )
      );

      return false;
    }
  };

  const handlePhoneVerify = async () => {
    const codeLength =
      AUTH_CONSTANTS?.SMS_CODE_LENGTH || 6;

    if (!authCode.trim()) {
      alert(
        AUTH_CONSTANTS.MSG_ENTER_AUTH_CODE.replace(
          "{length}",
          codeLength
        )
      );

      return;
    }

    if (authCode.length !== codeLength) {
      alert(
        AUTH_CONSTANTS.MSG_EXACT_AUTH_CODE.replace(
          "{length}",
          codeLength
        )
      );

      return;
    }

    try {
      const verificationStartedAt = Date.now();

      await verifyPhoneVerification({
        phone: normalizePhone(formData.phone),
        code: authCode,
        type: VERIFICATION_TYPE.MEMBER_UPDATE,
      });

      setIsPhoneVerified(true);
      setPhoneVerifiedUntil(
        verificationStartedAt + AUTH_CONSTANTS.VERIFIED_VALID_SECONDS * 1000
      );

      alert(
        AUTH_CONSTANTS.MSG_PHONE_VERIFIED_SUCCESS
      );
    } catch (error) {
      console.error("전화번호 인증 실패:", error);

      setIsPhoneVerified(false);
      setPhoneVerifiedUntil(0);

      alert(
        getApiErrorMessage(
          error,
          "인증번호 확인 중 오류가 발생했습니다."
        )
      );
    }
  };

  // 프로필 정보 수정 저장 제출 핸들러
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!isPhoneVerified || Date.now() >= phoneVerifiedUntil) {
      setIsPhoneVerified(false);
      setPhoneVerifiedUntil(0);

      alert(AUTH_CONSTANTS.MSG_NEED_PHONE_VERIFY);

      return;
    }

    // 백엔드 MemberUpdateRequestDTO 매핑 (nickname, password, phone)
    // phone은 백엔드 encryptPhone()을 위해 필수 전달
    const updateData = {
      nickname: formData.nickname,
      phone: normalizePhone(formData.phone),
    };

    // 비밀번호를 입력한 경우에만 전달
    if (
      formData.password &&
      formData.password.trim() !== ""
    ) {
      updateData.password = formData.password;
    }

    try {
      await updateMyProfile(updateData);

      alert(AUTH_CONSTANTS.MSG_UPDATE_SUCCESS);

      setIsEditing(false);
      setIsPhoneVerified(false);
      setPhoneVerifiedUntil(0);
      setAuthCode("");
      setShowFormPassword(false);

      await fetchMemberData();
    } catch (error) {
      console.error("회원정보 수정 실패:", error);

      alert(
        getApiErrorMessage(
          error,
          "회원 정보 수정 중 오류가 발생했습니다."
        )
      );
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

    handleSendPhoneCode,
    handlePhoneVerify,
    handleUpdateSubmit,
  };
};
