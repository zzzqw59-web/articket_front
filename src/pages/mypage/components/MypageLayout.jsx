import { Outlet } from "react-router-dom";
import MypageSidebar from "./MypageSidebar.jsx";

const MypageLayout = () => {
  return (
    <div className="flex w-full min-h-[calc(100vh-140px)] bg-white">
    {/* 마이페이지 레이아웃: 사이드바만 #F6F1E8, 우측 바탕은 흰색(#FFFFFF) */}
      {/* 왼쪽 끝에 밀착되는 #F6F1E8 사이드바 */}
      <aside className="w-56 flex-shrink-0 bg-[#F6F1E8]">
        <MypageSidebar />
      </aside>

      {/* 오른쪽 흰색(#FFFFFF) 메인 콘텐츠 영역 */}
      <section className="flex-1 p-8 flex justify-center items-start bg-white">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default MypageLayout;