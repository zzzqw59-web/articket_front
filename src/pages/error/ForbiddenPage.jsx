import { Link } from "react-router-dom";
import catLogo from "../../asset/cat-favicon.svg";

const ForbiddenPage = ({ fullScreen = false }) => {
  return (
    <section className={`head-text flex ${fullScreen ? "min-h-screen" : "min-h-[65vh]"} items-center justify-center bg-[#FAF9F6] px-6 py-20`}>
      <div className="w-full max-w-[740px] text-center">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src={catLogo} alt="" className="h-9 w-9 object-contain" />
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#938B81]">
            ARTICKET · ACCESS DENIED
          </span>
        </div>

        <p className="text-[110px] font-semibold leading-none tracking-[-0.08em] text-[#24211D] sm:text-[160px]">
          403
        </p>

        <div className="mx-auto my-8 h-px w-16 bg-[#C9BDAE]" />

        <h1 className="text-[25px] font-semibold tracking-[-0.04em] text-[#24211D] sm:text-[32px]">
          접근 권한이 없습니다.
        </h1>
        <p className="mt-4 text-[13px] leading-7 text-[#817A71] sm:text-[15px]">
          현재 계정으로는 요청하신 페이지를 이용할 수 없습니다.
          <br className="hidden sm:block" />
          이용 가능한 페이지로 이동해 주세요.
        </p>

        <Link
          to="/articket"
          className="mt-10 inline-flex items-center justify-center gap-3 rounded-md bg-[#24211D] px-7 py-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[#514B44]"
        >
          메인으로 돌아가기
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
};

export default ForbiddenPage;