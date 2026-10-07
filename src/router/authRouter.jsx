import LoginPage from "../pages/auth/LoginPage";
import PasswordFindPage from "../pages/auth/PasswordFindPage";
import PasswordResetPage from "../pages/auth/PasswordResetPage";
import SignupPage from "../pages/auth/SignupPage";

const authRouter = () => [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "password/find",
    element: <PasswordFindPage />,
  },
  {
    path: "password/reset",
    element: <PasswordResetPage />,
  },
];

export default authRouter;