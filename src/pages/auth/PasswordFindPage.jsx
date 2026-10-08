import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  findPassword,
  sendPhoneVerification,
  verifyPhoneVerification,
} from "../../api/authApi";
import { AUTH_CONSTANTS, VERIFICATION_TYPE } from "../../constants/authConstants";
import AuthCard from "./components/AuthCard";
import {
  formatPhone,
  getApiErrorMessage,
  isValidPhone,
  normalizePhone,
} from "./utils/authFormUtils";

const PasswordFindPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneExists, setPhoneExists] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState("");

  useEffect(() => {
    if (!codeSent || timeLeft <= 0) return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [codeSent, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remain = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
  };

  const handlePhoneChange = (value) => {
    setPhone(normalizePhone(value));
    setCode("");
    setPhoneExists(false);
    setCodeSent(false);
    setTimeLeft(0);
    setMessage({ type: "", text: "" });
    sessionStorage.removeItem("passwordResetPhone");
  };

  const handleCheckPhoneAndSend = async () => {
    if (!isValidPhone(phone)) {
      setMessage({ type: "error", text: "올바른 휴대폰 번호를 입력해 주세요." });
      return;
    }

    try {
      setBusy("find");
      const result = await findPassword(phone);

      if (!result?.exists) {
        setPhoneExists(false);
        setCodeSent(false);
        setMessage({ type: "error", text: "가입된 휴대폰 번호를 찾을 수 없습니다." });
        return;
      }

      setPhoneExists(true);
      await sendPhoneVerification({
        phone,
        type: VERIFICATION_TYPE.PASSWORD_RESET,
      });
      setCodeSent(true);
      setTimeLeft(300);
      setCode("");
      setMessage({ type: "success", text: "인증번호를 전송했습니다. 5분 안에 입력해 주세요." });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "비밀번호 찾기 요청에 실패했습니다."),
      });
    } finally {
      setBusy("");
    }
  };

  const handleVerify = async () => {
    if (!phoneExists || !codeSent) {
      setMessage({ type: "error", text: "먼저 가입된 전화번호 확인과 인증번호 전송을 진행해 주세요." });
      return;
    }

    if (code.length !== AUTH_CONSTANTS.SMS_CODE_LENGTH) {
      setMessage({ type: "error", text: "인증번호 6자리를 입력해 주세요." });
      return;
    }

    try {
      setBusy("verify");
      await verifyPhoneVerification({
        phone,
        code,
        type: VERIFICATION_TYPE.PASSWORD_RESET,
      });
      sessionStorage.setItem("passwordResetPhone", phone);
      navigate("/articket/password/reset");
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "인증번호 확인에 실패했습니다."),
      });
    } finally {
      setBusy("");
    }
  };

  return (
    <AuthCard
      title="비밀번호 찾기"
      description="가입한 휴대폰 번호를 인증한 뒤 새 비밀번호를 설정할 수 있습니다."
      maxWidth="max-w-xl"
    >
      <div className="head-text flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">전화번호</label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={formatPhone(phone)}
              onChange={(event) => handlePhoneChange(event.target.value)}
              placeholder="010-0000-0000"
              autoComplete="tel"
              className="flex-1 min-w-0 px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white"
            />
            <button
              type="button"
              onClick={handleCheckPhoneAndSend}
              disabled={busy === "find"}
              className="px-4 py-3 text-sm font-semibold bg-[#1f2937] text-white rounded-md hover:bg-[#111827] disabled:bg-gray-300 whitespace-nowrap"
            >
              {busy === "find" ? "확인 중" : codeSent ? "재전송" : "인증번호 전송"}
            </button>
          </div>
        </div>

        {codeSent && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">인증번호</label>
              <span className="text-xs font-bold text-[#c65b62]">유효시간 {formatTime(timeLeft)}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, AUTH_CONSTANTS.SMS_CODE_LENGTH))}
                disabled={timeLeft === 0}
                placeholder="6자리 인증번호 입력"
                className="flex-1 min-w-0 px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={timeLeft === 0 || busy === "verify"}
                className="px-4 py-3 text-sm font-semibold bg-[#d97706] text-white rounded-md hover:bg-[#b86105] disabled:bg-gray-300 whitespace-nowrap"
              >
                {busy === "verify" ? "확인 중" : "인증하기"}
              </button>
            </div>
          </div>
        )}

        {message.text && (
          <p
            className={`text-sm rounded-md px-3 py-2 border ${
              message.type === "success"
                ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                : "text-red-600 bg-red-50 border-red-100"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="pt-2 text-center text-xs text-gray-500">
          <Link to="/articket/login" className="text-[#d97706] font-bold hover:underline">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};

export default PasswordFindPage;
