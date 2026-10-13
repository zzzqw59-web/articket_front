import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import AuthCard from "./components/AuthCard";
import PasswordInput from "./components/PasswordInput";
import { formatPhone, getApiErrorMessage } from "./utils/authFormUtils";

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const verifiedPhone = sessionStorage.getItem("passwordResetPhone");
    if (!verifiedPhone) {
      navigate("/articket/password/find", { replace: true });
      return;
    }
    setPhone(verifiedPhone);
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!newPassword) {
      setErrorMessage("새 비밀번호를 입력해 주세요.");
      return;
    }

    if (newPassword !== passwordConfirm) {
      setErrorMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword({ phone, newPassword });
      sessionStorage.removeItem("passwordResetPhone");
      alert("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.");
      navigate("/articket/login", { replace: true });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "비밀번호 재설정에 실패했습니다. 인증을 다시 진행해 주세요.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="비밀번호 재설정"
      description="인증이 완료된 계정의 새 비밀번호를 입력해 주세요."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="head-text flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">인증된 전화번호</label>
          <input
            type="text"
            value={formatPhone(phone)}
            disabled
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-100 text-gray-500 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">새 비밀번호</label>
          <PasswordInput
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="새 비밀번호를 입력해 주세요"
            autoComplete="new-password"
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">새 비밀번호 확인</label>
          <PasswordInput
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="새 비밀번호를 다시 입력해 주세요"
            autoComplete="new-password"
            className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[#d97706] focus:bg-white"
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !phone}
          className="w-full py-3 rounded-md bg-[#1f2937] text-white font-bold hover:bg-[#111827] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "변경 중..." : "비밀번호 변경"}
        </button>

        <p className="text-center text-xs text-gray-500">
          인증을 다시 진행하려면{" "}
          <Link to="/articket/password/find" className="text-[#d97706] font-bold hover:underline">
            비밀번호 찾기
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default PasswordResetPage;
