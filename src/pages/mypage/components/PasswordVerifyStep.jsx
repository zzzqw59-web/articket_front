import ActionButton from "../../../components/common/ActionButton";

const PasswordVerifyStep = ({
  checkPassword,
  setCheckPassword,
  showCheckPassword,
  setShowCheckPassword,
  onVerifySubmit,
  renderEyeIcon,
}) => {
  return (
    <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-sm p-8 mt-10 flex flex-col items-center">
      <h2 className="text-xl font-bold text-gray-900 mb-1">비밀번호 입력</h2>
      <p className="text-xs text-gray-500 mb-6">
        회원정보 확인을 위해 비밀번호를 재확인 합니다.
      </p>

      <form onSubmit={onVerifySubmit} className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Password</label>
          <div className="relative w-full">
            <input
              type={showCheckPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-600"
            />
            {renderEyeIcon(showCheckPassword, () =>
              setShowCheckPassword(!showCheckPassword)
            )}
          </div>
        </div>

        <ActionButton
          label="입력 확인"
          variant="primary"
          type="submit"
          className="w-full mt-2"
        />
      </form>
    </div>
  );
};

export default PasswordVerifyStep;