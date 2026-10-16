import { Link } from "react-router-dom";
import catLogo from "../../asset/cat-favicon.svg";

const ServerErrorPage = ({ fullScreen = false }) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <section className={`head-text flex ${fullScreen ? "min-h-screen" : "min-h-[65vh]"} items-center justify-center bg-[#FAF9F6] px-6 py-20`}>
      <div className="w-full max-w-[740px] text-center">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src={catLogo} alt="" className="h-9 w-9 object-contain" />
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#938B81]">
            ARTICKET · SERVER ERROR
          </span>
        </div>

        <p className="text-[110px] font-semibold leading-none tracking-[-0.08em] text-[#24211D] sm:text-[160px]">
          500
        </p>

        <div className="mx-auto my-8 h-px w-16 bg-[#C9BDAE]" />

        <h1 className="text-[25px] font-semibold tracking-[-0.04em] text-[#24211D] sm:text-[32px]">
          일시적인 오류가 발생했습니다.
        </h1>
        <p className="mt-4 text-[13px] leading-7 text-[#817A71] sm:text-[15px]">
          서버에서 요청을 처리하는 중 문제가 발생했습니다.
          <br className="hidden sm:block" />
          잠시 후 다시 시도해 주세요.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center justify-center rounded-md bg-[#24211D] px-7 py-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[#514B44]"
          >
            다시 시도
          </button>
          <Link
            to="/articket"
            className="inline-flex items-center justify-center rounded-md border border-[#C9BDAE] px-7 py-3.5 text-[13px] font-medium text-[#24211D] transition-colors hover:bg-[#EAE5DE]"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServerErrorPage;