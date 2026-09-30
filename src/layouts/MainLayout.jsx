import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router";
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen pt-35">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
