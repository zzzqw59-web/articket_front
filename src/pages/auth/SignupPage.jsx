import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkEmail,
  sendPhoneVerification,
  signup,
  verifyPhoneVerification,
} from "../../api/authApi";
import { AUTH_CONSTANTS, VERIFICATION_TYPE } from "../../constants/authConstants";
import AuthCard from "./components/AuthCard";
import PasswordInput from "./components/PasswordInput";
import {
  formatPhone,
  getApiErrorMessage,
  isValidEmail,
  isValidPhone,
  normalizePhone,
} from "./utils/authFormUtils";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
  phone: "",
  code: "",
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState("");

  useEffect(() => {
    if (!codeSent || phoneVerified || timeLeft <= 0) return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [codeSent, phoneVerified, timeLeft]);

  const setField = (name, value) => {
    setMessage({ type: "", text: "" });

    if (name === "email") {
      setEmailChecked(false);
      setEmailAvailable(false);
    }

    if (name === "phone") {
      setCodeSent(false);
      setPhoneVerified(false);
      setTimeLeft(0);
      setForm((prev) => ({ ...prev, phone: normalizePhone(value), code: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remain = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
  };

  const handleEmailCheck = async () => {
    const email = form.email.trim();

    if (!isValidEmail(email)) {
      setMessage({ type: "error", text: "올바른 이메일 형식을 입력해 주세요." });
      return;
    }

    try {
      setBusy("email");
      const result = await checkEmail(email);
      const available = Boolean(result?.available);
      setEmailChecked(true);
      setEmailAvailable(available);
      setMessage({
        type: available ? "success" : "error",
        text: available ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "이메일 중복 확인에 실패했습니다."),
      });
    } finally {
      setBusy("");
    }
  };

  const handleSendCode = async () => {
    if (!isValidPhone(form.phone)) {
      setMessage({ type: "error", text: "올바른 휴대폰 번호를 입력해 주세요." });
      return;
    }

    try {
      setBusy("send");
      await sendPhoneVerification({
        phone: form.phone,
        type: VERIFICATION_TYPE.SIGNUP,
      });
      setCodeSent(true);
      setPhoneVerified(false);
      setTimeLeft(300);
      setForm((prev) => ({ ...prev, code: "" }));
      setMessage({ type: "success", text: "인증번호를 전송했습니다. 5분 안에 입력해 주세요." });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "인증번호 전송에 실패했습니다."),
      });
    } finally {
      setBusy("");
    }
  };

  const handleVerifyCode = async () => {
    if (form.code.length !== AUTH_CONSTANTS.SMS_CODE_LENGTH) {
      setMessage({
        type: "error",
        text: `인증번호 ${AUTH_CONSTANTS.SMS_CODE_LENGTH}자리를 입력해 주세요.`,
      });
      return;
    }

    try {
      setBusy("verify");
      await verifyPhoneVerification({
        phone: form.phone,
        code: form.code,
        type: VERIFICATION_TYPE.SIGNUP,
      });
      setPhoneVerified(true);
      setMessage({ type: "success", text: "휴대폰 인증이 완료되었습니다." });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "인증번호 확인에 실패했습니다."),
      });
    } finally {
      setBusy("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.nickname.trim()) {
      setMessage({ type: "error", text: "이름과 닉네임을 입력해 주세요." });
      return;
    }

    if (!emailChecked || !emailAvailable) {
      setMessage({ type: "error", text: "이메일 중복 확인을 완료해 주세요." });
      return;
    }

    if (!form.password) {
      setMessage({ type: "error", text: "비밀번호를 입력해 주세요." });
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setMessage({ type: "error", text: "비밀번호 확인이 일치하지 않습니다." });
      return;
    }

    if (!phoneVerified) {
      setMessage({ type: "error", text: "휴대폰 인증을 완료해 주세요." });
      return;
    }

    if (!agreed) {
      setMessage({ type: "error", text: "이용약관 및 개인정보 처리방침에 동의해 주세요." });
      return;
    }

    try {
      setBusy("signup");
      await signup({
        email: form.email.trim(),
        password: form.password,
        nickname: form.nickname.trim(),
        name: form.name.trim(),
        phone: form.phone,
      });
      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/articket/login", { replace: true });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "회원가입에 실패했습니다."),
      });
    } finally {
      setBusy("");
    }
  };

  return (
    <AuthCard
      title="회원가입"
      description="ARTICKET 이용을 위한 회원 정보를 입력해 주세요."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="head-text flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">이름</label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="이름을 입력해 주세요"
            autoComplete="name"
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">이메일</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              className="flex-1 min-w-0 px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white"
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              disabled={busy === "email"}
              className="px-4 py-3 text-sm font-semibold bg-[#1f2937] text-white rounded-md hover:bg-[#111827] disabled:bg-gray-300 whitespace-nowrap"
            >
              {busy === "email" ? "확인 중" : "중복확인"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">비밀번호</label>
          <PasswordInput
            value={form.password}
            onChange={(event) => setField("password", event.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            autoComplete="new-password"
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">비밀번호 확인</label>
          <PasswordInput
            value={form.passwordConfirm}
            onChange={(event) => setField("passwordConfirm", event.target.value)}
            placeholder="비밀번호를 다시 입력해 주세요"
            autoComplete="new-password"
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">닉네임</label>
          <input
            type="text"
            value={form.nickname}
            onChange={(event) => setField("nickname", event.target.value)}
            placeholder="닉네임을 입력해 주세요"
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">전화번호</label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={formatPhone(form.phone)}
              onChange={(event) => setField("phone", event.target.value)}
              disabled={phoneVerified}
              placeholder="010-0000-0000"
              autoComplete="tel"
              className="flex-1 min-w-0 px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={phoneVerified || busy === "send"}
              className="px-4 py-3 text-sm font-semibold bg-[#1f2937] text-white rounded-md hover:bg-[#111827] disabled:bg-gray-300 whitespace-nowrap"
            >
              {busy === "send" ? "전송 중" : codeSent ? "재전송" : "인증번호 전송"}
            </button>
          </div>
        </div>

        {codeSent && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">인증번호</label>
              {!phoneVerified && (
                <span className="text-xs font-bold text-[#c65b62]">유효시간 {formatTime(timeLeft)}</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={form.code}
                onChange={(event) => setField("code", event.target.value.replace(/\D/g, "").slice(0, AUTH_CONSTANTS.SMS_CODE_LENGTH))}
                disabled={phoneVerified || timeLeft === 0}
                placeholder="6자리 인증번호 입력"
                className="flex-1 min-w-0 px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={phoneVerified || timeLeft === 0 || busy === "verify"}
                className="px-4 py-3 text-sm font-semibold bg-[#d97706] text-white rounded-md hover:bg-[#b86105] disabled:bg-gray-300 whitespace-nowrap"
              >
                {phoneVerified ? "인증완료" : busy === "verify" ? "확인 중" : "인증하기"}
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

        <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer select-none mt-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="w-4 h-4 mt-0.5 accent-[#d97706]"
          />
          <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
        </label>

        <button
          type="submit"
          disabled={busy === "signup"}
          className="w-full py-3 mt-2 rounded-md bg-[#1f2937] text-white font-bold hover:bg-[#111827] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {busy === "signup" ? "가입 처리 중..." : "가입하기"}
        </button>

        <p className="text-center text-xs text-gray-500">
          이미 회원이신가요?{" "}
          <Link to="/articket/login" className="text-[#d97706] font-bold hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default SignupPage;
