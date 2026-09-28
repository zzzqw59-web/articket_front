import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const MypageSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "회원 정보 관리",
      path: "/articket/mypage/edit",
    },
    {
      name: "예약/결제 내역",
      path: "/articket/mypage/reservations",
      isCustomActive: (pathname) =>
        pathname.startsWith("/articket/mypage/reservations") ||
        pathname.startsWith("/articket/mypage/payments"),
    },
    {
      name: "위시리스트",
      path: "/articket/mypage/wishlist",
    },
    {
      name: "내 게시물",
      path: "/articket/mypage/my-posts",
    },
    {
      name: "관람 내역",
      path: "/articket/mypage/history",
    },
  ];

  return (
    <nav className="w-56 h-full pt-8 flex flex-col text-sm text-gray-800">
      {menuItems.map((item, index) => {
        const isActive = item.isCustomActive
          ? item.isCustomActive(location.pathname)
          : location.pathname.startsWith(item.path);

        return (
          <NavLink
            key={index}
            to={item.path}
            className={`px-8 py-4 transition-colors duration-150 ${
              isActive
                ? "bg-white font-bold text-gray-900 shadow-sm" // 선택된 메뉴는 흰색(#FFFFFF)
                : "hover:bg-[#EAE4D9] text-gray-600"
            }`}
          >
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MypageSidebar;