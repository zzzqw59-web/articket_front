import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import AuthCard from "./components/AuthCard";
import PasswordInput from "./components/PasswordInput";
import { getApiErrorMessage, isValidEmail } from "./utils/authFormUtils";

const REMEMBER_EMAIL_KEY = "rememberEmail";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!isValidEmail(email)) {
      setErrorMessage("올바른 이메일 형식을 입력해 주세요.");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email: email.trim(), password });

      if (rememberEmail) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      navigate(redirect?.startsWith("/articket") ? redirect : "/articket", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "이메일 또는 비밀번호를 확인해 주세요."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="로그인" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="head-text flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-sm font-semibold text-gray-700">
            이메일
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@articket.com"
            autoComplete="email"
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className="text-sm font-semibold text-gray-700">
            비밀번호
          </label>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            autoComplete="current-password"
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-xs">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberEmail}
              onChange={(event) => setRememberEmail(event.target.checked)}
              className="w-4 h-4 accent-[#d97706]"
            />
            이메일 기억하기
          </label>
          <Link
            to="/articket/password/find"
            className="text-[#c65b62] hover:underline font-semibold"
          >
            비밀번호 찾기
          </Link>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-md bg-[#1f2937] text-white font-bold hover:bg-[#111827] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>

        <p className="text-center text-xs text-gray-500">
          아직 회원이 아니신가요?{" "}
          <Link to="/articket/signup" className="text-[#d97706] font-bold hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
