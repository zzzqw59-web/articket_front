import { useEffect } from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import ServerErrorPage from "./ServerErrorPage";
import ForbiddenPage from "./ForbiddenPage";
import NotFoundPage from "./NotFoundPage";
import catLogo from "../../asset/cat-favicon.svg";

const RouteErrorPage = () => {
  const error = useRouteError();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("라우터 렌더링 또는 로딩 오류:", error);
    }
  }, [error]);

  const isResponseError = isRouteErrorResponse(error);
  const isForbidden = isResponseError && error.status === 403;
  const isNotFound = isResponseError && error.status === 404;
  const isServerError = isResponseError && error.status >= 500;

  const handleRetry = () => {
    window.location.reload();
  };

  if (isForbidden) {
    return <ForbiddenPage fullScreen />;
  }

  if (isNotFound) {
    return <NotFoundPage />;
  }

  if (isServerError) {
    return <ServerErrorPage fullScreen />;
  }

  return (
    <section className="head-text flex min-h-screen items-center justify-center bg-[#FAF9F6] px-6 py-20">
      <div className="w-full max-w-[740px] text-center">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src={catLogo} alt="" className="h-9 w-9 object-contain" />
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#938B81]">
            ARTICKET · PAGE ERROR
          </span>
        </div>

        <p className="text-[88px] font-semibold leading-none text-[#24211D] sm:text-[120px]">
          !
        </p>

        <div className="mx-auto my-8 h-px w-16 bg-[#C9BDAE]" />

        <h1 className="text-[25px] font-semibold tracking-[-0.04em] text-[#24211D] sm:text-[32px]">
          페이지를 불러오지 못했습니다.
        </h1>
        <p className="mt-4 text-[13px] leading-7 text-[#817A71] sm:text-[15px]">
          페이지를 표시하는 중 문제가 발생했습니다.
          <br className="hidden sm:block" />
          다시 시도해도 해결되지 않으면 잠시 후 이용해 주세요.
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

export default RouteErrorPage;