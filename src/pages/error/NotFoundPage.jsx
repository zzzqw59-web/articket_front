import { Link } from "react-router-dom";
import catLogo from "../../asset/cat-favicon.svg";

const NotFoundPage = () => {
  return (
    <section className="head-text flex min-h-[65vh] items-center justify-center bg-[#FAF9F6] px-6 py-20">
      <div className="w-full max-w-[740px] text-center">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src={catLogo} alt="" className="h-9 w-9 object-contain" />
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#938B81]">
            ARTICKET · PAGE NOT FOUND
          </span>
        </div>

        <p className="text-[110px] font-semibold leading-none tracking-[-0.08em] text-[#24211D] sm:text-[160px]">
          404
        </p>

        <div className="mx-auto my-8 h-px w-16 bg-[#C9BDAE]" />

        <h1 className="text-[25px] font-semibold tracking-[-0.04em] text-[#24211D] sm:text-[32px]">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="mt-4 text-[13px] leading-7 text-[#817A71] sm:text-[15px]">
          요청하신 주소가 잘못되었거나 페이지가 이동 또는 삭제되었을 수 있습니다.
          <br className="hidden sm:block" />
          아래 버튼을 눌러 메인 페이지로 이동해 주세요.
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

export default NotFoundPage;