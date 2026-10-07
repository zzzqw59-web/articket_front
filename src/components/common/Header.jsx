import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationBell from "./NotificationBell";
import { logout } from "../../api/authApi";
import {
  AUTH_STORAGE_EVENT,
  getStoredAuthUser,
} from "../../api/authStorage";
import { getMyMember } from "../../api/memberApi";

const Header = () => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [authUser, setAuthUser] = useState(() => getStoredAuthUser());

  const [nickname, setNickname] = useState("");

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const syncAuthUser = () => {
      setAuthUser(getStoredAuthUser());
    };

    window.addEventListener(AUTH_STORAGE_EVENT, syncAuthUser);
    window.addEventListener("storage", syncAuthUser);

    return () => {
      window.removeEventListener(
        AUTH_STORAGE_EVENT,
        syncAuthUser
      );

      window.removeEventListener(
        "storage",
        syncAuthUser
      );
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!authUser) {
      setNickname("");
      return undefined;
    }

    const loadMember = async () => {
      try {
        const member = await getMyMember();

        if (!cancelled) {
          setNickname(
            member?.nickname || "회원"
          );
        }
      } catch (error) {
        if (!cancelled) {
          setNickname("회원");
        }

        console.error(
          "회원 정보를 불러오는 데 실패했습니다.",
          error
        );
      }
    };

    loadMember();

    return () => {
      cancelled = true;
    };
  }, [authUser?.memberId]);

  const handleScrollClick = (e) => {
    if (e.target.closest("a")) {
      window.scrollTo(0, 0);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await logout();

      navigate(
        "/articket",
        {
          replace: true,
        }
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isStaff =
    authUser?.memberType === "STAFF";

  const isAdmin =
    authUser?.memberType === "ADMIN";

  return (
    <div
      onClick={handleScrollClick}
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-600
        ${
          isVisible
            ? "translate-y-0"
            : "-translate-y-full"
        }`}
    >
      <div className="bg-[#ede6d6] h-35 flex flex-row justify-between">
        <Link to="/articket">
          <div
            className="logo text-7xl select-none cursor-pointer mt-13 m-4 ml-6 flex items-end transition-colors duration-100
          hover:text-[#ede6d6] hover:[--text-stroke-width:1px] hover:[--text-stroke-color:#000000] 
          hover:[-webkit-text-stroke-width:1px] hover:[-webkit-text-stroke-color:#000000]"
          >
            Articket
          </div>
        </Link>

        <div className="flex flex-col justify-end items-end">
          <div className="flex flex-row mr-5 items-center">
            {!authUser ? (
              <>
                <Link to="/articket/login">
                  <div
                    className="head-text font-bold text-sm w-15 h-15 border-2 border-[#0b2342] rounded-full select-none cursor-pointer 
                    flex items-center justify-center hover:bg-[#0b2342] hover:text-white transition-colors duration-300"
                  >
                    로그인
                  </div>
                </Link>

                <Link to="/articket/signup">
                  <div
                    className="head-text font-bold text-sm w-15 h-15 border-2 border-[#5c88a8] rounded-full select-none cursor-pointer 
                    flex items-center justify-center ml-2 hover:bg-[#5c88a8] hover:text-white transition-colors duration-300"
                  >
                    회원가입
                  </div>
                </Link>
              </>
            ) : (
              <>
                <div className="head-text font-bold text-sm mr-3 select-none">
                  {nickname} 님 환영합니다!
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="head-text font-bold text-sm w-15 h-15 border-2 border-[#0b2342] rounded-full select-none cursor-pointer
                  flex items-center justify-center hover:bg-[#0b2342] hover:text-white transition-colors duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut
                    ? "처리중"
                    : "로그아웃"}
                </button>
              </>
            )}

            {authUser && (
              <NotificationBell />
            )}
          </div>

          <div className="head-text flex flex-row mr-5 mb-5 mt-3 text-2xl cursor-pointer">
            <NavLink
              to="/articket/exhibition"
              className={({ isActive }) =>
                isActive
                  ? "font-bold "
                  : "text-gray-600"
              }
            >
              <div>전시</div>
            </NavLink>

            <div className="text-gray-600">
              &nbsp;·&nbsp;
            </div>

            <NavLink
              to="/articket/venue"
              className={({ isActive }) =>
                isActive
                  ? "font-bold "
                  : "text-gray-600"
              }
            >
              <div>전시장</div>
            </NavLink>

            <div className="text-gray-600">
              &nbsp;·&nbsp;
            </div>

            <NavLink
              to="/articket/intro"
              className={({ isActive }) =>
                isActive
                  ? "font-bold "
                  : "text-gray-600"
              }
            >
              <div>아티켓 소개</div>
            </NavLink>

            <div className="text-gray-600">
              &nbsp;·&nbsp;
            </div>

            <NavLink
              to="/articket/review"
              className={({ isActive }) =>
                isActive
                  ? "font-bold "
                  : "text-gray-600"
              }
            >
              <div>리뷰</div>
            </NavLink>

            <div className="text-gray-600">
              &nbsp;·&nbsp;
            </div>

            <NavLink
              to="/articket/ask"
              className={({ isActive }) =>
                isActive
                  ? "font-bold "
                  : "text-gray-600"
              }
            >
              <div>문의</div>
            </NavLink>

            {authUser && (
              <>
                <div className="text-gray-600">
                  &nbsp;·&nbsp;
                </div>

                <NavLink
                  to="/articket/mypage"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold "
                      : "text-gray-600"
                  }
                >
                  <div>마이 페이지</div>
                </NavLink>
              </>
            )}

            {isStaff && (
              <>
                <div className="text-gray-600">
                  &nbsp;·&nbsp;
                </div>

                <NavLink
                  to="/articket/staffpage"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold "
                      : "text-gray-600"
                  }
                >
                  <div>스태프 페이지</div>
                </NavLink>
              </>
            )}

            {isAdmin && (
              <>
                <div className="text-gray-600">
                  &nbsp;·&nbsp;
                </div>

                <NavLink
                  to="/articket/adminpage"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold "
                      : "text-gray-600"
                  }
                >
                  <div>어드민 페이지</div>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;