import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminFloatingNavigator = ({ isMain = true }) => {
  const navigate = useNavigate();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (!footer) {
      console.warn("site-footer를 찾을 수 없습니다.");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const handleNavigate = () => {
    navigate(isMain ? "/articket/adminpage/manage" : "/articket/adminpage");
  };

  if (isFooterVisible) return null;

  return (
    <button
      type="button"
      onClick={handleNavigate}
      aria-label={isMain ? "관리 페이지로 이동" : "메인 페이지로 이동"}
      className="fixed transition ease-in-out duration-300 bottom-6 right-6 z-50 flex h-15 w-35 items-center justify-center rounded-full bg-gray-900 text-xl text-white shadow-lg transition hover:scale-105 hover:bg-gray-700 active:scale-95"
    >
      {isMain ? "관리 페이지" : "메인 페이지"}
    </button>
  );
};

export default AdminFloatingNavigator;
