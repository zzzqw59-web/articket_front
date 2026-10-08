const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const AUTH_CHANGE_EVENT = "articket-auth-change";

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const getStoredAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getStoredRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const getStoredAuthUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const saveAuth = ({
  accessToken,
  refreshToken,
  memberId,
  memberType,
}) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (memberId !== undefined && memberId !== null && memberType) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        memberId,
        memberType,
      })
    );
  }

  notifyAuthChange();
};

export const updateAccessToken = (accessToken) => {
  if (!accessToken) {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  notifyAuthChange();
};

export const AUTH_STORAGE_EVENT = AUTH_CHANGE_EVENT;