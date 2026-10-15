import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationBell from "./NotificationBell";
import { logout } from "../../api/authApi";
import {
  AUTH_STORAGE_EVENT,
  MEMBER_PROFILE_UPDATED_EVENT,
  getStoredAuthUser,
} from "../../api/authStorage";
import { getMyMember } from "../../api/memberApi";

const IntroHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [authUser, setAuthUser] = useState(() => getStoredAuthUser());
  const [nickname, setNickname] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isStaff = authUser?.memberType === "STAFF";
  const isAdmin = authUser?.memberType === "ADMIN";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (
        (currentScrollY > lastScrollY && currentScrollY > 0) ||
        currentScrollY < 900
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleScrollClick = (e) => {
    if (e.target.closest("a")) {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const syncAuthUser = () => {
      setAuthUser(getStoredAuthUser());
    };

    window.addEventListener(AUTH_STORAGE_EVENT, syncAuthUser);
    window.addEventListener("storage", syncAuthUser);

    return () => {
      window.removeEventListener(AUTH_STORAGE_EVENT, syncAuthUser);

      window.removeEventListener("storage", syncAuthUser);
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
          setNickname(member?.nickname || "회원");
        }
      } catch (error) {
        if (!cancelled) {
          setNickname("회원");
        }

        console.error("회원 정보를 불러오는 데 실패했습니다.", error);
      }
    };

    loadMember();
    window.addEventListener(MEMBER_PROFILE_UPDATED_EVENT, loadMember);

    return () => {
      cancelled = true;
      window.removeEventListener(MEMBER_PROFILE_UPDATED_EVENT, loadMember);
    };
  }, [authUser?.memberId]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await logout();

      navigate("/articket", {
        replace: true,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 로그인 상태 동기화
  useEffect(() => {
    const syncAuthUser = () => {
      setAuthUser(getStoredAuthUser());
    };

    window.addEventListener(AUTH_STORAGE_EVENT, syncAuthUser);
    window.addEventListener("storage", syncAuthUser);

    return () => {
      window.removeEventListener(AUTH_STORAGE_EVENT, syncAuthUser);
      window.removeEventListener("storage", syncAuthUser);
    };
  }, []);

  // 회원 닉네임 조회
  useEffect(() => {
    let cancelled = false;

    if (!authUser) {
      setNickname("");
      return;
    }

    const loadMember = async () => {
      try {
        const member = await getMyMember();

        if (!cancelled) {
          setNickname(member?.nickname || "회원");
        }
      } catch (error) {
        if (!cancelled) {
          setNickname("회원");
        }

        console.error("회원 정보를 불러오는 데 실패했습니다.", error);
      }
    };

    loadMember();

    window.addEventListener(MEMBER_PROFILE_UPDATED_EVENT, loadMember);

    return () => {
      cancelled = true;

      window.removeEventListener(MEMBER_PROFILE_UPDATED_EVENT, loadMember);
    };
  }, [authUser?.memberId]);

  // 기본 메뉴
  const menuItems = [
    { label: "전시", path: "/articket/exhibition" },
    { label: "전시장", path: "/articket/venue" },
    { label: "아티켓 소개", path: "/articket/intro" },
    { label: "리뷰", path: "/articket/review" },
    { label: "문의", path: "/articket/ask" },
  ];

  if (authUser) {
    menuItems.push({
      label: "마이페이지",
      path: "/articket/mypage",
    });
  }

  if (isStaff) {
    menuItems.push({
      label: "스태프 페이지",
      path: "/articket/staffpage",
    });
  }

  if (isAdmin) {
    menuItems.push({
      label: "관리자 페이지",
      path: "/articket/adminpage",
    });
  }

  // 네비게이션 스타일
  const navLinkStyle = ({ isActive }) =>
    `
      relative whitespace-nowrap
      text-[14px] font-medium
      tracking-[-0.02em]
      transition-colors duration-200
      ${isActive ? "text-[#24221F]" : "text-[#706B63] hover:text-[#24221F]"}
    `;

  // 링크 클릭 처리
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header
      className={`
        fixed left-0 right-0 top-0 z-50
        border-b border-[#DDD5C8]
        bg-[#F3EEE4]/95
        backdrop-blur-md
        transition-transform duration-300
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* 전체 헤더 */}
      <div
        className="
          mx-auto flex h-20 w-full
          max-w-[1920px]
          items-center justify-between
          gap-6 px-6 lg:px-10
        "
      >
        {/* 왼쪽 로고 */}
        <Link
          to="/articket"
          onClick={handleLinkClick}
          className="flex shrink-0 items-center"
        >
          <span
            className="
              logo text-[40px]
              leading-none tracking-[-0.04em]
              text-[#24221F]
              transition-opacity duration-200
              hover:opacity-70
            "
          >
            Articket
          </span>
        </Link>

        {/* 오른쪽 PC 메뉴 */}
        <div
          className="
            ml-auto hidden
            items-center justify-end
            gap-7 2xl:flex
          "
        >
          {/* 네비게이션 */}
          <nav className="flex items-center gap-7">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={navLinkStyle}
              >
                {({ isActive }) => (
                  <span
                    className={`
                      relative inline-block py-2
                      after:absolute
                      after:bottom-0 after:left-0
                      after:h-[1px]
                      after:bg-[#24221F]
                      after:transition-all
                      after:duration-300
                      ${
                        isActive
                          ? "after:w-full"
                          : "after:w-0 hover:after:w-full"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* 구분선 */}
          <div className="h-5 w-px bg-[#CFC5B6]" />

          {/* 회원 영역 */}
          <div className="flex shrink-0 items-center gap-5">
            {!authUser ? (
              <>
                <Link
                  to="/articket/login"
                  onClick={handleLinkClick}
                  className="
                    whitespace-nowrap text-[13px]
                    text-[#4E4942]
                    transition-colors
                    hover:text-black
                  "
                >
                  로그인
                </Link>

                <Link
                  to="/articket/signup"
                  onClick={handleLinkClick}
                  className="
                    whitespace-nowrap
                    border border-[#292722]
                    px-4 py-2 text-[13px]
                    text-[#292722]
                    transition-all duration-200
                    hover:bg-[#292722]
                    hover:text-white
                  "
                >
                  회원가입
                </Link>
              </>
            ) : (
              <>
                {/* 닉네임 */}
                <span
                  className="
                    max-w-[130px]
                    truncate whitespace-nowrap
                    text-[13px] text-[#4E4942]
                  "
                  title={`${nickname}님`}
                >
                  {nickname}님
                </span>

                {/* 로그아웃 */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="
                    whitespace-nowrap
                    text-[13px] text-[#777168]
                    transition-colors duration-200
                    hover:text-[#24221F]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isLoggingOut ? "처리 중..." : "로그아웃"}
                </button>

                {/* 알림 */}
                <div className="flex items-center justify-center">
                  <NotificationBell />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 태블릿 / 모바일 메뉴 */}
        <div className="ml-auto flex items-center gap-4 2xl:hidden">
          {authUser && <NotificationBell />}

          <button
            type="button"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            aria-controls="articket-mobile-menu"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              setIsVisible(true);
            }}
            className="
              flex h-10 w-10
              flex-col items-center
              justify-center gap-[6px]
            "
          >
            <span
              className={`
                h-[1.5px] w-6
                bg-[#24221F]
                transition-transform duration-200
                ${isMenuOpen ? "translate-y-[7.5px] rotate-45" : ""}
              `}
            />

            <span
              className={`
                h-[1.5px] w-6
                bg-[#24221F]
                transition-opacity duration-200
                ${isMenuOpen ? "opacity-0" : ""}
              `}
            />

            <span
              className={`
                h-[1.5px] w-6
                bg-[#24221F]
                transition-transform duration-200
                ${isMenuOpen ? "-translate-y-[7.5px] -rotate-45" : ""}
              `}
            />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div
          id="articket-mobile-menu"
          className="
            max-h-[calc(100dvh-80px)]
            overflow-y-auto
            border-t border-[#DDD5C8]
            bg-[#F3EEE4]
            px-6 pb-8 pt-5
            2xl:hidden
          "
        >
          <nav className="flex flex-col gap-5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={navLinkStyle}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* 로그인 / 계정 영역 */}
          <div className="mt-7 border-t border-[#DDD5C8] pt-6">
            {!authUser ? (
              <div className="flex gap-6 text-sm">
                <Link
                  to="/articket/login"
                  onClick={handleLinkClick}
                  className="text-[#4E4942]"
                >
                  로그인
                </Link>

                <Link
                  to="/articket/signup"
                  onClick={handleLinkClick}
                  className="text-[#4E4942]"
                >
                  회원가입
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#4E4942]">{nickname}님</span>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="
                    text-sm text-[#777168]
                    disabled:opacity-50
                  "
                >
                  {isLoggingOut ? "처리 중..." : "로그아웃"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default IntroHeader;
