import { Navigate, Outlet } from "react-router-dom";
import { getStoredAccessToken } from "../api/authStorage"; 

const PrivateRoute = () => {
  // 저장소에 액세스 토큰이 존재하는지 확인
  const accessToken = getStoredAccessToken();
  const isLoggedIn = !!accessToken;

  // 비로그인 상태인 경우 로그인 페이지로 리다이렉트 (현재 접근하려던 경로를 redirect 쿼리로 넘겨주면 더 친화적입니다)
  if (!isLoggedIn) {
    const currentPath = window.location.pathname + window.location.search;
    return <Navigate to={`/articket/login?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }

  // 로그인 상태라면 해당 하위 페이지 컴포넌트 렌더링
  return <Outlet />;
};

export default PrivateRoute;